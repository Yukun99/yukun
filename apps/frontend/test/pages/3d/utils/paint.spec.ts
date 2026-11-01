import { remapPaint } from '@/pages/3d/utils/paint';
import { parseThreeMf } from '@/pages/3d/utils/three-mf';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { strFromU8, strToU8, unzipSync, zipSync } from 'three/examples/jsm/libs/fflate.module.js';

const NS = 'xmlns="http://schemas.microsoft.com/3dmanufacturing/core/2015/02"';
const same = (state: number) => state;

describe('remapPaint', () => {
  it('should reproduce every paint string of the real benchy file with the identity index', () => {
    const file = readFileSync(resolve(__dirname, '../../../../src/assets/catalog/benchy-colour.3mf'));
    const model = strFromU8(unzipSync(new Uint8Array(file))['3D/Objects/object_1.model']);
    const paints = new Set([...model.matchAll(/paint_color="([^"]*)"/g)].map((match) => match[1]));
    expect(paints.size).toBeGreaterThan(5);
    for (const paint of paints) expect(remapPaint(paint, same)).toBe(paint);
  });

  it('should move a one nibble state', () => {
    expect(remapPaint('8', (state) => (state === 2 ? 5 : state))).toBe('2C');
  });

  it('should move a long state down to a short one', () => {
    expect(remapPaint('0C', (state) => (state === 3 ? 1 : state))).toBe('4');
  });

  it('should encode state 18 with an extra nibble', () => {
    expect(remapPaint('4', () => 18)).toBe('0FC');
    expect(remapPaint('0FC', same)).toBe('0FC');
  });

  it('should keep state 0 and split nibbles', () => {
    expect(remapPaint('0', () => 4)).toBe('0');
    expect(remapPaint('485', (state) => (state === 2 ? 1 : state))).toBe('445');
  });

  it.each(['', 'xyz', 'c', '4B', '84', '88'])('should return null for %j', (paint) => {
    expect(remapPaint(paint, same)).toBeNull();
  });

  it('should produce a paint the parser reads as the remapped colour', () => {
    const colours = ['#111111', '#222222', '#333333'];
    const parse = (paint: string) => {
      const model =
        `<model ${NS}><resources><object id="1" type="model"><mesh><vertices>`
        + '<vertex x="0" y="0" z="0"/><vertex x="1" y="0" z="0"/><vertex x="0" y="1" z="0"/>'
        + `</vertices><triangles><triangle v1="0" v2="1" v3="2" paint_color="${paint}"/></triangles>`
        + '</mesh></object></resources><build><item objectid="1"/></build></model>';
      const bytes = zipSync({
        '3D/3dmodel.model': new Uint8Array(strToU8(model)),
        'Metadata/project_settings.config': new Uint8Array(
          strToU8(JSON.stringify({ filament_colour: colours })),
        ),
      });
      return parseThreeMf(bytes.slice().buffer)[0][0].colours;
    };
    expect(parse('8')).toEqual(['222222']);
    expect(parse(remapPaint('8', (state) => (state === 2 ? 3 : state)) as string)).toEqual(['333333']);
  });
});
