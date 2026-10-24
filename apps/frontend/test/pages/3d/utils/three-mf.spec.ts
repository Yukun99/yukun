import { parseThreeMf } from '@/pages/3d/utils/three-mf';
import { Box3, Mesh, type MeshStandardMaterial, Vector3 } from 'three';
import { strToU8, zipSync } from 'three/examples/jsm/libs/fflate.module.js';

const NS = 'xmlns="http://schemas.microsoft.com/3dmanufacturing/core/2015/02"';
const PNS = 'xmlns:p="http://schemas.microsoft.com/3dmanufacturing/production/2015/06"';

const RELS = `<?xml version="1.0" encoding="UTF-8"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Target="/3D/3dmodel.model" Id="rel0" Type="http://schemas.microsoft.com/3dmanufacturing/2013/01/3dmodel"/>
</Relationships>`;

const model = (body: string) =>
  `<?xml version="1.0" encoding="UTF-8"?><model unit="millimeter" ${NS} ${PNS}>${body}</model>`;

const mesh = (triangles: number) => {
  const vertices = Array.from({ length: triangles + 2 }, (_, i) => `<vertex x="${i}" y="${i % 2}" z="0"/>`);
  const tris = Array.from({ length: triangles }, (_, i) => `<triangle v1="${i}" v2="${i + 1}" v3="${i + 2}"/>`);
  return `<mesh><vertices>${vertices.join('')}</vertices><triangles>${tris.join('')}</triangles></mesh>`;
};

const zip = (files: Record<string, string>) => {
  const bytes = zipSync(Object.fromEntries(Object.entries(files).map(([k, v]) => [k, new Uint8Array(strToU8(v))])));
  return bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength) as ArrayBuffer;
};

const triangleCount = (meshes: Mesh[]) =>
  meshes.reduce((sum, m) => sum + (m.geometry.getIndex()?.count ?? 0) / 3, 0);

describe('parseThreeMf', () => {
  it('should read a generic file and apply the item transform', async () => {
    const buffer = zip({
      '_rels/.rels': RELS,
      '3D/3dmodel.model': model(
        `<resources><object id="1" type="model">${mesh(1)}</object></resources>`
          + '<build><item objectid="1" transform="1 0 0 0 1 0 0 0 1 10 0 0"/></build>',
      ),
    });
    const [group] = await parseThreeMf(buffer);
    const meshes = group.children as Mesh[];
    expect(meshes).toHaveLength(1);
    expect(meshes[0].geometry.getAttribute('position').count).toBe(3);
    expect(triangleCount(meshes)).toBe(1);
    group.updateMatrixWorld(true);
    const min = new Box3().setFromObject(group).min;
    expect(min.x).toBeCloseTo(10);
    expect(new Box3().setFromObject(group).getSize(new Vector3()).y).toBeCloseTo(0);
  });

  it('should resolve components through the production path', async () => {
    const buffer = zip({
      '_rels/.rels': RELS,
      '3D/3dmodel.model': model(
        `<resources>
          <object id="1" type="model">${mesh(1)}</object>
          <object id="2" type="model"><components><component p:path="/3D/Objects/object_1.model" objectid="1"/></components></object>
        </resources><build><item objectid="2"/></build>`,
      ),
      '3D/Objects/object_1.model': model(`<resources><object id="1" type="model">${mesh(2)}</object></resources>`),
    });
    const [group] = await parseThreeMf(buffer);
    expect(triangleCount(group.children as Mesh[])).toBe(2);
  });

  it.each([
    ['a triangle index out of range', '<vertex x="0" y="0" z="0"/>', '<triangle v1="0" v2="0" v3="5"/>'],
    ['a vertex that is not a number', '<vertex x="a" y="0" z="0"/>', '<triangle v1="0" v2="0" v3="0"/>'],
  ])('should reject %s', async (_label, vertex, triangle) => {
    const buffer = zip({
      '_rels/.rels': RELS,
      '3D/3dmodel.model': model(
        `<resources><object id="1" type="model"><mesh><vertices>${vertex}</vertices>`
          + `<triangles>${triangle}</triangles></mesh></object></resources>`
          + '<build><item objectid="1"/></build>',
      ),
    });
    await expect(parseThreeMf(buffer)).rejects.toThrow();
  });

  it('should keep the winding outward under a mirroring transform', async () => {
    const buffer = zip({
      '_rels/.rels': RELS,
      '3D/3dmodel.model': model(
        `<resources><object id="1" type="model">${mesh(1)}</object></resources>`
          + '<build><item objectid="1" transform="-1 0 0 0 1 0 0 0 1 0 0 0"/></build>',
      ),
    });
    const [group] = await parseThreeMf(buffer);
    expect(Array.from((group.children[0] as Mesh).geometry.getIndex()?.array ?? [])).toEqual([0, 2, 1]);
  });

  it('should reject a file without triangles', async () => {
    const buffer = zip({
      '_rels/.rels': RELS,
      '3D/3dmodel.model': model('<resources><object id="1" type="model"/></resources><build><item objectid="1"/></build>'),
    });
    await expect(parseThreeMf(buffer)).rejects.toThrow();
  });
});

describe('parseThreeMf plates', () => {
  const SETTINGS = `<?xml version="1.0" encoding="UTF-8"?><config>
    <plate><metadata key="plater_id" value="1"/><model_instance><metadata key="object_id" value="1"/><metadata key="instance_id" value="0"/></model_instance></plate>
    <plate><metadata key="plater_id" value="2"/><model_instance><metadata key="object_id" value="2"/><metadata key="instance_id" value="0"/></model_instance></plate>
  </config>`;
  const files = {
    '_rels/.rels': RELS,
    '3D/3dmodel.model': model(
      `<resources><object id="1" type="model">${mesh(1)}</object><object id="2" type="model">${mesh(2)}</object></resources>`
        + '<build><item objectid="1"/><item objectid="2"/></build>',
    ),
  };

  it('should split build items by plate from the Bambu settings', async () => {
    const plates = await parseThreeMf(zip({ ...files, 'Metadata/model_settings.config': SETTINGS }));
    expect(plates).toHaveLength(2);
    expect(triangleCount(plates[0].children as Mesh[])).toBe(1);
    expect(triangleCount(plates[1].children as Mesh[])).toBe(2);
  });

  it('should keep everything on one plate without settings', async () => {
    const plates = await parseThreeMf(zip(files));
    expect(plates).toHaveLength(1);
    expect(triangleCount(plates[0].children as Mesh[])).toBe(3);
  });
});

describe('parseThreeMf colours', () => {
  const GREY = 'bfbfbf';
  const verts = '<vertices><vertex x="0" y="0" z="0"/><vertex x="1" y="0" z="0"/><vertex x="0" y="1" z="0"/><vertex x="1" y="1" z="0"/></vertices>';
  const paintMesh = (...triangles: string[]) => `<mesh>${verts}<triangles>${triangles.join('')}</triangles></mesh>`;
  const tri = (v: string, attrs = '') => `<triangle ${v} ${attrs}/>`;
  const A = 'v1="0" v2="1" v3="2"';
  const B = 'v1="1" v2="3" v3="2"';
  const colours = (m: Mesh) => [m.material].flat().map((x) => (x as MeshStandardMaterial).color.getHexString());
  const project = (...c: string[]) => JSON.stringify({ filament_colour: c });

  const build = (body: string, extra: Record<string, string> = {}) =>
    zip({ '_rels/.rels': RELS, '3D/3dmodel.model': model(`${body}<build><item objectid="1"/></build>`), ...extra });
  const single = async (m: string, extra: Record<string, string> = {}) => {
    const [group] = await parseThreeMf(build(`<resources><object id="1" type="model">${m}</object></resources>`, extra));
    return group.children[0] as Mesh;
  };
  const PROJECT = { 'Metadata/project_settings.config': project('#FF0000', '#00FF00', '#0000FF') };

  it('should colour parts by their own or their object extruder', async () => {
    const buffer = zip({
      '_rels/.rels': RELS,
      '3D/3dmodel.model': model(
        '<resources><object id="1" type="model"><components>'
          + '<component p:path="/3D/Objects/o.model" objectid="1"/><component p:path="/3D/Objects/o.model" objectid="2"/>'
          + '</components></object></resources><build><item objectid="1"/></build>',
      ),
      '3D/Objects/o.model': model(
        `<resources><object id="1">${mesh(1)}</object><object id="2">${mesh(1)}</object></resources>`,
      ),
      'Metadata/project_settings.config': project('#FF0000', '#00FF00'),
      'Metadata/model_settings.config':
        '<config><object id="1"><metadata key="extruder" value="1"/><part id="2"><metadata key="extruder" value="2"/></part></object></config>',
    });
    const [group] = await parseThreeMf(buffer);
    expect((group.children as Mesh[]).map(colours)).toEqual([['ff0000'], ['00ff00']]);
  });

  it('should group painted triangles by extruder', async () => {
    const m = await single(paintMesh(tri(A, 'paint_color="8"'), tri(B)), PROJECT);
    expect(colours(m)).toEqual(['00ff00', 'ff0000']);
    expect(m.geometry.groups).toHaveLength(2);
  });

  it.each([
    ['0C', '0000ff'],
    ['0FC', GREY],
  ])('should read the extended paint %s', async (paint, colour) => {
    const m = await single(paintMesh(tri(A, `paint_color="${paint}"`)), PROJECT);
    expect(colours(m)).toContain(colour);
  });

  it('should subdivide a split triangle', async () => {
    const m = await single(paintMesh(tri(A, 'paint_color="481"')), PROJECT);
    expect(m.geometry.getIndex()?.count).toBe(6);
    expect(m.geometry.getAttribute('position').count).toBe(5);
    expect(colours(m)).toEqual(['ff0000', '00ff00']);
    expect(Array.from(m.geometry.getIndex()?.array ?? [])).toEqual([0, 1, 4, 4, 2, 0]);
  });

  it('should ignore a truncated paint string', async () => {
    const m = await single(paintMesh(tri(A, 'paint_color="41"')), PROJECT);
    expect(colours(m)).toEqual(['ff0000']);
    expect(m.geometry.getIndex()?.count).toBe(3);
  });

  it('should ignore an invalid paint string', async () => {
    const m = await single(paintMesh(tri(A, 'paint_color="4G"')), PROJECT);
    expect(colours(m)).toEqual(['ff0000']);
    expect(m.geometry.getIndex()?.count).toBe(3);
  });

  it.each([
    ['basematerials', '<basematerials id="5"><base name="a" displaycolor="#112233"/><base name="b" displaycolor="#445566"/></basematerials>'],
    ['colorgroup', '<m:colorgroup xmlns:m="http://schemas.microsoft.com/3dmanufacturing/material/2015/02" id="5"><m:color color="#112233"/><m:color color="#445566"/></m:colorgroup>'],
  ])('should read %s properties', async (_label, group) => {
    const body = `<resources>${group}<object id="1" pid="5" pindex="1">${paintMesh(tri(A), tri(B, 'pid="5" p1="0"'))}</object></resources>`;
    const [plate] = await parseThreeMf(build(body));
    expect(colours(plate.children[0] as Mesh)).toEqual(['445566', '112233']);
  });

  it('should fall back to grey without settings or materials', async () => {
    expect(colours(await single(mesh(1)))).toEqual([GREY]);
  });
});
