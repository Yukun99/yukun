import { removeItems } from '@/pages/3d/utils/remove-items';
import { parseThreeMf } from '@/pages/3d/utils/three-mf';
import { strFromU8, strToU8, zipSync } from 'three/examples/jsm/libs/fflate.module.js';

type Attrs = Record<string, string | number>;

// markup is built from parts so the IDE does not read the fixtures as HTML
const el = (name: string, attrs: Attrs = {}, body?: string) => {
  const list = Object.entries(attrs).map(([key, value]) => ` ${key}="${value}"`);
  return `<${name}${list.join('')}${body === undefined ? '/>' : `>${body}</${name}>`}`;
};
const head = (id: number) => el('object', { id }).slice(0, -2);
const lines = (...parts: string[]) => `\n${parts.join('\n')}\n`;

const NS = 'http://schemas.microsoft.com/3dmanufacturing/core/2015/02';
const PNS = 'http://schemas.microsoft.com/3dmanufacturing/production/2015/06';
const RELS_NS = 'http://schemas.openxmlformats.org/package/2006/relationships';
const MODEL_TYPE = 'http://schemas.microsoft.com/3dmanufacturing/2013/01/3dmodel';

const vertex = (x: number, y: number) => el('vertex', { x, y, z: 0 });
const mesh = el(
  'mesh',
  {},
  el('vertices', {}, vertex(0, 0) + vertex(1, 0) + vertex(0, 1))
    + el('triangles', {}, el('triangle', { v1: 0, v2: 1, v3: 2 })),
);
const model = (body: string) => el('model', { xmlns: NS, 'xmlns:p': PNS }, body);
const item = (objectid: number) => el('item', { objectid });
const solid = (id: number) => el('object', { id, type: 'model' }, mesh);
const rels = (...targets: string[]) =>
  el(
    'Relationships',
    { xmlns: RELS_NS },
    lines(
      ...targets.map((Target, i) => el('Relationship', { Target, Id: `rel${i}`, Type: MODEL_TYPE })),
    ),
  );

const RELS = rels('/3D/3dmodel.model');
const MODEL_RELS = rels('/3D/Objects/a.model', '/3D/Objects/b.model');

const assembly = (id: number, path: string) =>
  el(
    'object',
    { id, type: 'model' },
    el('components', {}, el('component', { 'p:path': path, objectid: 1 })),
  );
const ROOT = model(
  el(
    'resources',
    {},
    lines(assembly(2, '/3D/Objects/a.model'), assembly(4, '/3D/Objects/b.model')),
  ) + el('build', {}, lines(item(2), item(2), item(4), item(2))),
);
const PART = model(el('resources', {}, solid(1)));

const meta = (key: string, value: string | number) => el('metadata', { key, value });
const named = (id: number, name: string) => el('object', { id }, meta('name', name));
const instance = (object: number, index: number) =>
  el('model_instance', {}, meta('object_id', object) + meta('instance_id', index));
const assembled = (attrs: Attrs) => el('assemble_item', { ...attrs, transform: 1 });
const SETTINGS = el(
  'config',
  {},
  lines(
    named(2, 'a'),
    named(4, 'b'),
    el('plate', {}, lines(instance(2, 0), instance(2, 1), instance(4, 0), instance(2, 2))),
    el(
      'assemble',
      {},
      lines(
        assembled({ object_id: 2, instance_id: 0 }),
        assembled({ object_id: 2, instance_id: 1 }),
        assembled({ object_id: 4, instance_id: 0 }),
        assembled({ object_id: 2, instance_id: 2 }),
        assembled({ object_id: 4, volume_id: 0 }),
      ),
    ),
  ),
);

const base: Record<string, string> = {
  '_rels/.rels': RELS,
  '3D/3dmodel.model': ROOT,
  '3D/_rels/3dmodel.model.rels': MODEL_RELS,
  '3D/Objects/a.model': PART,
  '3D/Objects/b.model': PART,
  'Metadata/model_settings.config': SETTINGS,
  'Metadata/plate_1.gcode': 'G1',
};

type Files = Parameters<typeof removeItems>[0];

const files = (extra: Record<string, string> = {}) =>
  Object.fromEntries(
    Object.entries({ ...base, ...extra }).map(([k, v]) => [k, new Uint8Array(strToU8(v))]),
  ) as Files;
const text = (input: Files, path: string) => strFromU8(input[path]);
const zip = (input: Files) => {
  const bytes = zipSync(input);
  return bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength) as ArrayBuffer;
};
const count = (value: string, pattern: RegExp) => value.match(pattern)?.length ?? 0;

describe('removeItems', () => {
  it('should leave every file alone when nothing is removed', () => {
    const input = files();
    removeItems(input, []);
    expect(text(input, '3D/3dmodel.model')).toBe(ROOT);
    expect(text(input, 'Metadata/model_settings.config')).toBe(SETTINGS);
  });

  it('should drop a build item and renumber the later instances of its object', () => {
    const input = files();
    removeItems(input, [1]);
    expect(count(text(input, '3D/3dmodel.model'), /<item /g)).toBe(3);
    const settings = text(input, 'Metadata/model_settings.config');
    expect(count(settings, /<model_instance>/g)).toBe(3);
    expect(count(settings, /key="instance_id" value="2"/g)).toBe(0);
    expect(count(settings, /<assemble_item object_id="2"/g)).toBe(2);
    expect(count(settings, /instance_id="2"/g)).toBe(0);
    expect(settings).toContain(assembled({ object_id: 2, instance_id: 1 }));
    expect(input['3D/Objects/a.model']).toBeDefined();
    expect(text(input, 'Metadata/plate_1.gcode')).toBe('G1');
  });

  it('should renumber single quoted settings', () => {
    const input = files({ 'Metadata/model_settings.config': SETTINGS.replace(/"/g, "'") });
    removeItems(input, [0]);
    const settings = text(input, 'Metadata/model_settings.config');
    expect(settings).not.toContain("key='instance_id' value='2'");
    expect(settings).not.toContain("instance_id='2'");
  });

  it('should produce a file the parser reads without the removed items', () => {
    const input = files();
    removeItems(input, [0, 3]);
    const plates = parseThreeMf(zip(input));
    expect(plates.flat().map((part) => part.item)).toEqual([0, 1]);
  });

  it('should remove an object, its settings and its sub file once no item is left', () => {
    const input = files();
    removeItems(input, [2]);
    const root = text(input, '3D/3dmodel.model');
    expect(root).not.toContain(head(4));
    expect(root).toContain(head(2));
    const settings = text(input, 'Metadata/model_settings.config');
    expect(settings).not.toContain(head(4));
    expect(settings).not.toContain('"4"');
    expect(input['3D/Objects/b.model']).toBeUndefined();
    expect(input['3D/Objects/a.model']).toBeDefined();
    const rels = text(input, '3D/_rels/3dmodel.model.rels');
    expect(rels).not.toContain('b.model');
    expect(rels).toContain('a.model');
  });

  it('should keep a sub file that a remaining object still uses', () => {
    const input = files({ '3D/3dmodel.model': ROOT.replace('b.model', 'a.model') });
    removeItems(input, [2]);
    expect(input['3D/Objects/a.model']).toBeDefined();
    expect(text(input, '3D/_rels/3dmodel.model.rels')).toContain('a.model');
  });

  it('should only rewrite the build and orphaned objects in a plain 3MF', () => {
    const plain = model(
      el('resources', {}, lines(solid(1), solid(2))) + el('build', {}, item(1) + item(2)),
    );
    const input = { '3D/3dmodel.model': new Uint8Array(strToU8(plain)) } as Files;
    removeItems(input, [0]);
    const root = strFromU8(input['3D/3dmodel.model']);
    expect(root).not.toContain(head(1));
    expect(root).toContain(head(2));
    expect(count(root, /<item /g)).toBe(1);
  });
});
