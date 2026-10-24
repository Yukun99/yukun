import {
  BufferAttribute,
  BufferGeometry,
  Group,
  Matrix4,
  Mesh,
  MeshStandardMaterial,
} from 'three';
import { strFromU8, unzipSync } from 'three/examples/jsm/libs/fflate.module.js';

const MAX_DEPTH = 32;
const DEFAULT_MODEL = '3D/3dmodel.model';
const SETTINGS = 'Metadata/model_settings.config';
const PROJECT = 'Metadata/project_settings.config';
const GREY = 'bfbfbf';

type Tri = [number, number, number];
type Leaf = { tri: Tri; state: number };
type Config = { extruder: number; parts: Map<string, number> };
type Groups = Map<string, (string | null)[]>;
type MeshInfo = {
  groups: Groups;
  object: Element;
  extruder: number;
  filaments: (string | null)[];
};

const strip = (path: string) => path.replace(/^\/+/, '');

const children = (element: Element, name: string) =>
  Array.from(element.children).filter((child) => child.localName === name);

const attribute = (element: Element, name: string) =>
  Array.from(element.attributes).find((attr) => attr.localName === name)?.value ?? null;

const readTransform = (value: string | null) => {
  const matrix = new Matrix4();
  const n = value?.trim().split(/\s+/).map(Number) ?? [];
  if (n.length === 12 && n.every(Number.isFinite)) {
    matrix.set(n[0], n[3], n[6], n[9], n[1], n[4], n[7], n[10], n[2], n[5], n[8], n[11], 0, 0, 0, 1);
  }
  return matrix;
};

const parseXml = (bytes: Uint8Array) => {
  const doc = new DOMParser().parseFromString(strFromU8(bytes), 'application/xml');
  if (doc.getElementsByTagName('parsererror').length) throw new Error('Invalid XML');
  return doc;
};

const hex = (value: unknown) => {
  const match = /^#?([0-9a-f]{6})(?:[0-9a-f]{2})?$/i.exec(typeof value === 'string' ? value.trim() : '');
  return match ? match[1].toLowerCase() : null;
};

const metadata = (element: Element, key: string) =>
  children(element, 'metadata').find((meta) => meta.getAttribute('key') === key)?.getAttribute('value');

const extruderOf = (element: Element) => {
  const value = Number(metadata(element, 'extruder'));
  return Number.isInteger(value) && value > 0 ? value : null;
};

// Bambu Studio lists which build item sits on which plate, plus the extruder of each object and part
const readSettings = (bytes: Uint8Array | undefined) => {
  const plates = new Map<string, number>();
  const configs = new Map<string, Config>();
  if (!bytes) return { plates, configs };
  const root = parseXml(bytes).documentElement;
  children(root, 'plate').forEach((plate, index) => {
    for (const instance of children(plate, 'model_instance')) {
      plates.set(`${metadata(instance, 'object_id')}:${metadata(instance, 'instance_id') ?? 0}`, index);
    }
  });
  for (const object of children(root, 'object')) {
    const parts = new Map<string, number>();
    for (const part of children(object, 'part')) {
      const extruder = extruderOf(part);
      if (extruder) parts.set(part.getAttribute('id') ?? '', extruder);
    }
    configs.set(object.getAttribute('id') ?? '', { extruder: extruderOf(object) ?? 1, parts });
  }
  return { plates, configs };
};

const readFilaments = (bytes: Uint8Array | undefined) => {
  if (!bytes) return [];
  try {
    const colours = JSON.parse(strFromU8(bytes))?.filament_colour;
    return Array.isArray(colours) ? colours.map(hex) : [];
  } catch {
    return [];
  }
};

const readGroups = (doc: Document): Groups => {
  const groups: Groups = new Map();
  const resources = children(doc.documentElement, 'resources')[0];
  for (const group of resources ? Array.from(resources.children) : []) {
    const isBase = group.localName === 'basematerials';
    if (!isBase && group.localName !== 'colorgroup') continue;
    groups.set(
      group.getAttribute('id') ?? '',
      children(group, isBase ? 'base' : 'color').map((item) =>
        hex(item.getAttribute(isBase ? 'displaycolor' : 'color')),
      ),
    );
  }
  return groups;
};

// paint strings are hex nibbles read back to front, describing a tree of triangle splits
const decodePaint = (paint: string, tri: Tri, midpoint: (a: number, b: number) => number) => {
  if (!/^[0-9A-F]+$/.test(paint)) return null;
  const codes = Array.from(paint, (char) => parseInt(char, 16)).reverse();
  let pos = 0;
  const next = () => {
    if (pos >= codes.length) throw new RangeError('Truncated paint');
    return codes[pos++];
  };
  const node = (current: Tri): Leaf[] => {
    const code = next();
    const split = code & 3;
    if (!split) {
      if ((code & 12) !== 12) return [{ tri: current, state: code >> 2 }];
      let n = next();
      let extra = 0;
      while (n === 15) {
        extra++;
        n = next();
      }
      return [{ tri: current, state: n + 15 * extra + 3 }];
    }
    const [v0, v1, v2] = [0, 1, 2].map((k) => current[((code >> 2) + k) % 3]);
    let kids: Tri[];
    if (split === 1) {
      const m12 = midpoint(v1, v2);
      kids = [[v0, v1, m12], [m12, v2, v0]];
    } else if (split === 2) {
      const m01 = midpoint(v0, v1);
      const m20 = midpoint(v2, v0);
      kids = [[v0, m01, m20], [m01, v1, m20], [v1, v2, m20]];
    } else {
      const m01 = midpoint(v0, v1);
      const m12 = midpoint(v1, v2);
      const m20 = midpoint(v2, v0);
      kids = [[v0, m01, m20], [m01, v1, m12], [m12, v2, m20], [m01, m12, m20]];
    }
    const leaves: Leaf[][] = [];
    for (let i = split; i >= 0; i--) leaves[i] = node(kids[i]);
    return leaves.flat();
  };
  try {
    return node(tri);
  } catch (error) {
    if (error instanceof RangeError) return null;
    throw error;
  }
};

const buildGeometry = (mesh: Element, matrix: Matrix4, info: MeshInfo) => {
  const vertices = children(children(mesh, 'vertices')[0] ?? mesh, 'vertex');
  const triangles = children(children(mesh, 'triangles')[0] ?? mesh, 'triangle');
  if (!vertices.length || !triangles.length) return null;

  const positions: number[] = [];
  vertices.forEach((vertex) => {
    ['x', 'y', 'z'].forEach((axis) => {
      const value = Number(vertex.getAttribute(axis));
      if (!Number.isFinite(value)) throw new Error('Invalid vertex');
      positions.push(value);
    });
  });
  const midpoints = new Map<string, number>();
  const midpoint = (a: number, b: number) => {
    const key = a < b ? `${a}_${b}` : `${b}_${a}`;
    let index = midpoints.get(key);
    if (index === undefined) {
      index = positions.length / 3;
      for (let k = 0; k < 3; k++) positions.push((positions[a * 3 + k] + positions[b * 3 + k]) / 2);
      midpoints.set(key, index);
    }
    return index;
  };

  const { groups, object, extruder, filaments } = info;
  const bambu = filaments.length > 0;
  const lookup = (pid: string | null, index: string | null) =>
    groups.get(pid ?? '')?.[Number(index ?? 0)] ?? null;
  const objectColour = lookup(attribute(object, 'pid'), attribute(object, 'pindex'));
  const filament = (index: number) => filaments[index - 1] ?? GREY;
  const flip = matrix.determinant() < 0;
  const buckets = new Map<string, number[]>();

  for (const triangle of triangles) {
    const tri = ['v1', 'v2', 'v3'].map((key) => {
      const value = Number(triangle.getAttribute(key));
      if (!Number.isInteger(value) || value < 0 || value >= vertices.length) {
        throw new Error('Invalid triangle');
      }
      return value;
    }) as Tri;
    const paint = attribute(triangle, 'paint_color') ?? attribute(triangle, 'mmu_segmentation');
    const leaves = (paint && decodePaint(paint, tri, midpoint)) || [{ tri, state: 0 }];
    const p1 = attribute(triangle, 'p1');
    const base = bambu
      ? filament(extruder)
      : ((p1 === null ? null : lookup(attribute(triangle, 'pid') ?? attribute(object, 'pid'), p1))
        ?? objectColour
        ?? GREY);
    for (const leaf of leaves) {
      const colour = leaf.state > 0 ? filament(leaf.state) : base;
      const bucket = buckets.get(colour) ?? [];
      buckets.set(colour, bucket);
      bucket.push(leaf.tri[0], leaf.tri[flip ? 2 : 1], leaf.tri[flip ? 1 : 2]);
    }
  }

  const geometry = new BufferGeometry();
  geometry.setAttribute('position', new BufferAttribute(new Float32Array(positions), 3));
  const indices = new Uint32Array(Array.from(buckets.values()).reduce((sum, b) => sum + b.length, 0));
  let start = 0;
  Array.from(buckets.values()).forEach((bucket, i) => {
    geometry.addGroup(start, bucket.length, i);
    indices.set(bucket, start);
    start += bucket.length;
  });
  geometry.setIndex(new BufferAttribute(indices, 1));
  geometry.applyMatrix4(matrix);
  return { geometry, colours: Array.from(buckets.keys()) };
};

export const parseThreeMf = async (buffer: ArrayBuffer): Promise<Group[]> => {
  const files = unzipSync(new Uint8Array(buffer));
  const docs = new Map<string, Document>();
  const read = (path: string) => {
    let doc = docs.get(path);
    if (!doc) {
      const bytes = files[path];
      if (!bytes) throw new Error(`Missing ${path}`);
      doc = parseXml(bytes);
      docs.set(path, doc);
    }
    return doc;
  };

  let rootPath = DEFAULT_MODEL;
  if (files['_rels/.rels']) {
    const rels = Array.from(parseXml(files['_rels/.rels']).getElementsByTagName('Relationship'));
    const target = rels.find((rel) => rel.getAttribute('Type')?.endsWith('/3dmodel'))?.getAttribute('Target');
    if (target) rootPath = strip(target);
  }

  const parts = new Map<string, Map<string, Element>>();
  const objects = (path: string) => {
    let part = parts.get(path);
    if (!part) {
      const resources = children(read(path).documentElement, 'resources')[0];
      part = new Map(
        (resources ? children(resources, 'object') : []).map((object) => [attribute(object, 'id') ?? '', object]),
      );
      parts.set(path, part);
    }
    return part;
  };

  const groupsByPath = new Map<string, Groups>();
  const groupsOf = (path: string) => {
    let groups = groupsByPath.get(path);
    if (!groups) groupsByPath.set(path, (groups = readGroups(read(path))));
    return groups;
  };

  const filaments = readFilaments(files[PROJECT]);
  const materials = new Map<string, MeshStandardMaterial>();
  const materialOf = (colour: string) => {
    let material = materials.get(colour);
    if (!material) {
      material = new MeshStandardMaterial({
        color: parseInt(colour, 16),
        roughness: 0.6,
        metalness: 0.05,
        flatShading: true,
      });
      materials.set(colour, material);
    }
    return material;
  };

  const plates: Group[] = [];
  let triangleCount = 0;

  const walk = (
    group: Group,
    id: string | null,
    path: string,
    matrix: Matrix4,
    depth: number,
    config: Config,
    extruder: number,
  ) => {
    if (depth > MAX_DEPTH) throw new Error('Components nested too deeply');
    const object = objects(path).get(id ?? '');
    if (!object) throw new Error(`Missing object ${id} in ${path}`);

    const mesh = children(object, 'mesh')[0];
    if (mesh) {
      const built = buildGeometry(mesh, matrix, { groups: groupsOf(path), object, extruder, filaments });
      if (built) {
        triangleCount += (built.geometry.getIndex()?.count ?? 0) / 3;
        group.add(new Mesh(built.geometry, built.colours.map(materialOf)));
      }
    }
    const components = children(object, 'components')[0];
    if (components) {
      for (const component of children(components, 'component')) {
        const next = attribute(component, 'path');
        const part = attribute(component, 'objectid');
        walk(
          group,
          part,
          next ? strip(next) : path,
          matrix.clone().multiply(readTransform(attribute(component, 'transform'))),
          depth + 1,
          config,
          config.parts.get(part ?? '') ?? extruder,
        );
      }
    }
  };

  const { plates: plateOf, configs } = readSettings(files[SETTINGS]);
  const instances = new Map<string, number>();
  const build = children(read(rootPath).documentElement, 'build')[0];
  for (const item of build ? children(build, 'item') : []) {
    const id = attribute(item, 'objectid') ?? '';
    const instance = instances.get(id) ?? 0;
    instances.set(id, instance + 1);
    const index = plateOf.get(`${id}:${instance}`) ?? 0;
    const group = (plates[index] ??= new Group());
    const path = attribute(item, 'path');
    const config = configs.get(id) ?? { extruder: 1, parts: new Map<string, number>() };
    const transform = readTransform(attribute(item, 'transform'));
    walk(group, id, path ? strip(path) : rootPath, transform, 0, config, config.extruder);
  }

  if (!triangleCount) throw new Error('No triangles in model');
  const filled = plates.filter((plate) => plate.children.length);
  filled.forEach((plate) => (plate.rotation.x = -Math.PI / 2));
  return filled;
};
