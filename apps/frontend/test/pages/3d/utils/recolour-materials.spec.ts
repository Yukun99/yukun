import { recolourMaterials } from '@/pages/3d/utils/recolour-materials';
import { parseThreeMf } from '@/pages/3d/utils/three-mf';
import { strToU8, zipSync } from 'three/examples/jsm/libs/fflate.module.js';

const NS = 'xmlns="http://schemas.microsoft.com/3dmanufacturing/core/2015/02"';

const mesh = (triangles: string[]) =>
  '<mesh><vertices><vertex x="0" y="0" z="0"/><vertex x="1" y="0" z="0"/><vertex x="0" y="1" z="0"/>'
  + `</vertices><triangles>${triangles.join('')}</triangles></mesh>`;

const tri = (attrs: string) => `<triangle v1="0" v2="1" v3="2" ${attrs}/>`;
const el = (name: string, attrs: string, inner?: string) =>
  inner === undefined ? `<${name} ${attrs}/>` : `<${name} ${attrs}>${inner}</${name}>`;
const open = (name: string, attrs: string) => `<${name} ${attrs}>`;

const MODEL = `<?xml version="1.0" encoding="UTF-8"?><model ${NS}><resources>
<basematerials id="1"><base name="a" displaycolor="#FF0000"/><base name="b" displaycolor="#00FF00"/></basematerials>
<basematerials id="2"><base name="c" displaycolor="#112233"/><base name="d" displaycolor="#0000FF"/></basematerials>
<object id="1" type="model" pid="2" pindex="0">${mesh([tri('p1="1"'), tri('pid="1" p1="0"'), tri('')])}</object>
<object id="2" type="model" pid="1" pindex="1">${mesh([tri('p1="1"'), tri('pid="2" p1="0" p2="1" p3="0"')])}</object>
</resources><build><item objectid="1"/><item objectid="2"/></build></model>`;

const MAPPING = { '112233': '00ff00' };

const parse = (model: string) => {
  const bytes = zipSync({ '3D/3dmodel.model': new Uint8Array(strToU8(model)) });
  const [plate] = parseThreeMf(bytes.slice().buffer);
  return plate.map((part) => ({ colours: [...part.colours].sort(), count: part.index.length / 3 }));
};

describe('recolourMaterials', () => {
  const out = recolourMaterials(MODEL, MAPPING);

  it('should do only the colour rewrite when nothing merges', () => {
    expect(recolourMaterials(MODEL, {})).toBe(MODEL);
    expect(recolourMaterials(MODEL, { ff0000: '010101' })).toBe(
      MODEL.replace('#FF0000', '#010101'),
    );
  });

  it('should drop merged entries and empty groups, and rewrite the references', () => {
    expect(out).toContain(
      el('basematerials', 'id="1"', el('base', 'name="a" displaycolor="#FF0000"') + el('base', 'name="b" displaycolor="#00FF00"')),
    );
    expect(out).toContain(el('basematerials', 'id="2"', el('base', 'name="d" displaycolor="#0000FF"')));
    expect(out).toContain(open('object', 'id="1" type="model" pid="1" pindex="1"'));
    expect(out).toContain(open('object', 'id="2" type="model" pid="1" pindex="1"'));
  });

  it('should write an explicit pid only where the group differs from the object', () => {
    expect(out).toContain('<triangle v1="0" v2="1" v3="2" p1="0" pid="2"/>');
    expect(out).toContain('<triangle v1="0" v2="1" v3="2" pid="1" p1="0"/>');
    expect(out).toContain('<triangle v1="0" v2="1" v3="2" p1="1"/>');
  });

  it('should drop p2 and p3 that leave the first group', () => {
    expect(out).toContain('<triangle v1="0" v2="1" v3="2" pid="1" p1="1" p3="1"/>');
    expect(out).not.toContain('p2=');
  });

  it('should keep the colours and triangle count the parser sees', () => {
    const before = parse(MODEL.replace('#112233', '#00FF00'));
    const after = parse(out);
    expect(after).toEqual(before);
    expect(after[0].colours).toEqual(['0000ff', '00ff00', 'ff0000']);
  });

  it('should handle namespaced groups', () => {
    const text = `<model ${NS}><resources><m:colorgroup id="1"><m:color color="#FF0000"/><m:color color="#ff0000"/></m:colorgroup>`
      + `${el('object', 'id="1" pid="1" pindex="1"', mesh([tri('')]))}</resources></model>`;
    const next = recolourMaterials(text, {});
    expect(next).toContain('<m:colorgroup id="1"><m:color color="#FF0000"/></m:colorgroup>');
    expect(next).toContain('pindex="0"');
  });

  it('should drop a merged entry written with a closing tag', () => {
    const red = el('base', 'displaycolor="#FF0000"', '');
    const green = el('base', 'displaycolor="#00FF00"');
    const group = el('basematerials', 'id="1"', red + red + green);
    const text = `<model ${NS}><resources>${group}${el('object', 'id="1" pid="1" pindex="2"', mesh([tri('')]))}</resources></model>`;
    const next = recolourMaterials(text, {});
    expect(next).toContain(el('basematerials', 'id="1"', red + green));
    expect(next).toContain('pindex="1"');
  });
});
