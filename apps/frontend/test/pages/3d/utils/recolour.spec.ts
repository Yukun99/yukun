import { collectColours } from '@/pages/3d/utils/colours';
import { buildPlates } from '@/pages/3d/utils/load-three-mf';
import { recolourThreeMf } from '@/pages/3d/utils/recolour';
import { parseThreeMf } from '@/pages/3d/utils/three-mf';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { strFromU8, strToU8, unzipSync, zipSync } from 'three/examples/jsm/libs/fflate.module.js';

const NS = 'xmlns="http://schemas.microsoft.com/3dmanufacturing/core/2015/02"';

const RELS = `<?xml version="1.0" encoding="UTF-8"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Target="/3D/3dmodel.model" Id="rel0" Type="http://schemas.microsoft.com/3dmanufacturing/2013/01/3dmodel"/>
</Relationships>`;

const mesh = `<mesh><vertices><vertex x="0" y="0" z="0"/><vertex x="1" y="0" z="0"/><vertex x="0" y="1" z="0"/></vertices><triangles><triangle v1="0" v2="1" v3="2"/></triangles></mesh>`;

const MAIN = `<?xml version="1.0" encoding="UTF-8"?><model ${NS}><resources>
  <basematerials id="1"><base name="a" displaycolor="#FF0000"/><base name="b" displaycolor='#123456'/></basematerials>
  <colorgroup id="2"><color color="#00ff00ff"/></colorgroup>
  <object id="1" type="model" pid="1" pindex="0">${mesh}</object>
  <object id="2" type="model" pid="2" pindex="0">${mesh}</object>
</resources><build><item objectid="1"/><item objectid="2"/></build></model>`;

const PART = `<?xml version="1.0" encoding="UTF-8"?><model ${NS}><resources><basematerials id="1"><base name="a" displaycolor="#ff0000"/></basematerials></resources></model>`;
const PROJECT = JSON.stringify({
  filament_colour: ['#FF0000', '#0000FF'],
  filament_multi_colour: ['#FF0000 #00FF00', '#0000FF'],
  other: 1,
});
const PLATE = '{"a": 1}';

const files: Record<string, string> = {
  '_rels/.rels': RELS,
  '3D/3dmodel.model': MAIN,
  '3D/Objects/part.model': PART,
  'Metadata/project_settings.config': PROJECT,
  'Metadata/plate_1.json': PLATE,
};

const build = (skip?: string) => {
  const bytes = zipSync(Object.fromEntries(Object.entries(files).filter(([k]) => k !== skip).map(([k, v]) => [k, new Uint8Array(strToU8(v))])));
  return bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength) as ArrayBuffer;
};

const run = (mapping: Record<string, string>) => {
  const out = recolourThreeMf(build(), mapping);
  return { out, files: unzipSync(new Uint8Array(out)) };
};

describe('recolourThreeMf', () => {
  const { out, files: result } = run({ ff0000: '0000ffcc', '00ff00': '112233' });

  it('should rewrite mapped attributes in every model file', () => {
    const main = strFromU8(result['3D/3dmodel.model']);
    expect(main).toContain('displaycolor="#0000FFCC"');
    expect(main).toContain('color="#112233"');
    expect(strFromU8(result['3D/Objects/part.model'])).toContain('displaycolor="#0000FFCC"');
  });

  it('should leave unmapped colours alone', () => {
    expect(strFromU8(result['3D/3dmodel.model'])).toContain("displaycolor='#123456'");
  });

  it('should drop alpha, rewrite every multi colour token and merge equal filaments', () => {
    const project = JSON.parse(strFromU8(result['Metadata/project_settings.config']));
    expect(project).toEqual({
      filament_colour: ['#0000FF'],
      filament_multi_colour: ['#0000FF #112233'],
      other: 1,
    });
  });

  it('should pass other files through untouched', () => {
    expect(strFromU8(result['Metadata/plate_1.json'])).toBe(PLATE);
    expect(strFromU8(result['_rels/.rels'])).toBe(RELS);
  });

  it('should produce a file the parser reads with the new filament colours', () => {
    expect([...collectColours(buildPlates(parseThreeMf(out))).keys()]).toEqual(['0000ff']);
  });

  it('should produce a file the parser reads with the new material colours', () => {
    const plain = recolourThreeMf(build('Metadata/project_settings.config'), {
      ff0000: '0000ffcc',
      '00ff00': '112233',
    });
    const colours = [...collectColours(buildPlates(parseThreeMf(plain))).keys()];
    expect(colours.sort()).toEqual(['0000ff', '112233']);
  });

  it('should not touch attributes that only end in color', () => {
    const model = `<model ${NS}><triangle v1="0" paint_color="ff0000" color="#FF0000"/></model>`;
    const bytes = zipSync({ '3D/3dmodel.model': new Uint8Array(strToU8(model)) });
    const out = recolourThreeMf(bytes.slice().buffer, { ff0000: '00ff00' });
    expect(strFromU8(unzipSync(new Uint8Array(out))['3D/3dmodel.model'])).toBe(
      `<model ${NS}><triangle v1="0" paint_color="ff0000" color="#00FF00"/></model>`,
    );
  });

  it.each(['not json', '{"other": 1}', '{ "filament_colour": ["#123456"] }'])(
    'should keep project settings %j byte for byte',
    (text) => {
      const bytes = zipSync({ 'Metadata/project_settings.config': new Uint8Array(strToU8(text)) });
      const out = recolourThreeMf(bytes.slice().buffer, { ff0000: '00ff00' });
      expect(strFromU8(unzipSync(new Uint8Array(out))['Metadata/project_settings.config'])).toBe(text);
    },
  );

  it('should return a tight buffer', () => {
    expect(new Uint8Array(out).subarray(0, 4)).toEqual(new Uint8Array([0x50, 0x4b, 0x03, 0x04]));
  });
});

describe('recolourThreeMf on a real Bambu project', { timeout: 30_000 }, () => {
  const original = new Uint8Array(
    readFileSync(resolve(__dirname, '../../../../src/assets/catalog/benchy-colour.3mf')),
  );
  const buffer = () => original.slice().buffer;
  const total = (plates: ReturnType<typeof parseThreeMf>) =>
    plates.flat().reduce((sum, part) => sum + part.index.length / 3, 0);
  const colours = (plates: ReturnType<typeof parseThreeMf>) =>
    new Set(plates.flat().flatMap((part) => part.colours));
  let before: ReturnType<typeof parseThreeMf>;

  beforeAll(() => {
    before = parseThreeMf(buffer());
  }, 30_000);

  it('should merge one filament into another', () => {
    const project = JSON.parse(strFromU8(unzipSync(original)['Metadata/project_settings.config']));
    const [from, to] = [project.filament_colour[0], project.filament_colour[4]] as string[];
    const out = recolourThreeMf(buffer(), { [from.slice(1).toLowerCase()]: to.slice(1) });
    const after = parseThreeMf(out);
    expect(total(after)).toBe(total(before));
    expect(colours(after).size).toBe(colours(before).size - 1);
    const next = JSON.parse(strFromU8(unzipSync(new Uint8Array(out))['Metadata/project_settings.config']));
    expect(next.filament_colour).toHaveLength(6);
  });

  it('should keep a file with no duplicate colours parsing the same', () => {
    const after = parseThreeMf(recolourThreeMf(buffer(), {}));
    expect(total(after)).toBe(total(before));
    expect(colours(after)).toEqual(colours(before));
  });
});
