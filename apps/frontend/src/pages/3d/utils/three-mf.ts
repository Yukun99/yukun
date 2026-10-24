import { parseXml, type XmlNode } from '@/pages/3d/utils/xml';
import { strFromU8, unzipSync } from 'three/examples/jsm/libs/fflate.module.js';

const MAX_DEPTH = 32;
const DEFAULT_MODEL = '3D/3dmodel.model';
const SETTINGS = 'Metadata/model_settings.config';
const PROJECT = 'Metadata/project_settings.config';
const GREY = 'bfbfbf';

type MeshData = {
  positions: Float32Array;
  index: Uint32Array;
  groups: { start: number; count: number }[];
  colours: string[];
};
export type PlateData = MeshData[];
export type WorkerResult = { plates: PlateData[] } | { error: string };

type Tri = [number, number, number];
type Leaf = { tri: Tri; state: number };
type Config = { extruder: number; parts: Map<string, number> };
type Groups = Map<string, (string | null)[]>;
type Matrix = number[];
type MeshInfo = {
  groups: Groups;
  object: XmlNode;
  extruder: number;
  filaments: (string | null)[];
};

const strip = (path: string) => path.replace(/^\/+/, '');

const children = (node: XmlNode, name: string) =>
  node.children.filter((child) => child.name === name);

const attribute = (node: XmlNode, name: string) => node.attrs[name] ?? null;

const identity = (): Matrix => [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];

const readTransform = (value: string | null): Matrix => {
  const n = value?.trim().split(/\s+/).map(Number) ?? [];
  if (n.length !== 12 || !n.every(Number.isFinite)) return identity();
  return [n[0], n[3], n[6], n[9], n[1], n[4], n[7], n[10], n[2], n[5], n[8], n[11], 0, 0, 0, 1];
};

const multiply = (a: Matrix, b: Matrix): Matrix => {
  const out: Matrix = new Array(16);
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      let sum = 0;
      for (let k = 0; k < 4; k++) sum += a[r * 4 + k] * b[k * 4 + c];
      out[r * 4 + c] = sum;
    }
  }
  return out;
};

const determinant3 = (m: Matrix) =>
  m[0] * (m[5] * m[10] - m[6] * m[9])
  - m[1] * (m[4] * m[10] - m[6] * m[8])
  + m[2] * (m[4] * m[9] - m[5] * m[8]);

const applyToPositions = (m: Matrix, positions: Float32Array) => {
  for (let i = 0; i < positions.length; i += 3) {
    const x = positions[i];
    const y = positions[i + 1];
    const z = positions[i + 2];
    positions[i] = m[0] * x + m[1] * y + m[2] * z + m[3];
    positions[i + 1] = m[4] * x + m[5] * y + m[6] * z + m[7];
    positions[i + 2] = m[8] * x + m[9] * y + m[10] * z + m[11];
  }
};

const parseBytes = (bytes: Uint8Array) => parseXml(strFromU8(bytes));

const hex = (value: unknown) => {
  const match = /^#?([0-9a-f]{6})(?:[0-9a-f]{2})?$/i.exec(typeof value === 'string' ? value.trim() : '');
  return match ? match[1].toLowerCase() : null;
};

const metadata = (node: XmlNode, key: string) =>
  children(node, 'metadata').find((meta) => meta.attrs.key === key)?.attrs.value;

const extruderOf = (node: XmlNode) => {
  const value = Number(metadata(node, 'extruder'));
  return Number.isInteger(value) && value > 0 ? value : null;
};

// Bambu Studio lists which build item sits on which plate, plus the extruder of each object and part
const readSettings = (bytes: Uint8Array | undefined) => {
  const plates = new Map<string, number>();
  const configs = new Map<string, Config>();
  if (!bytes) return { plates, configs };
  const root = parseBytes(bytes);
  children(root, 'plate').forEach((plate, index) => {
    for (const instance of children(plate, 'model_instance')) {
      plates.set(`${metadata(instance, 'object_id')}:${metadata(instance, 'instance_id') ?? 0}`, index);
    }
  });
  for (const object of children(root, 'object')) {
    const parts = new Map<string, number>();
    for (const part of children(object, 'part')) {
      const extruder = extruderOf(part);
      if (extruder) parts.set(part.attrs.id ?? '', extruder);
    }
    configs.set(object.attrs.id ?? '', { extruder: extruderOf(object) ?? 1, parts });
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

const readGroups = (root: XmlNode): Groups => {
  const groups: Groups = new Map();
  const resources = children(root, 'resources')[0];
  for (const group of resources?.children ?? []) {
    const isBase = group.name === 'basematerials';
    if (!isBase && group.name !== 'colorgroup') continue;
    groups.set(
      group.attrs.id ?? '',
      children(group, isBase ? 'base' : 'color').map((item) =>
        hex(item.attrs[isBase ? 'displaycolor' : 'color']),
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

const buildMesh = (mesh: XmlNode, matrix: Matrix, info: MeshInfo): MeshData | null => {
  const vertices = children(children(mesh, 'vertices')[0] ?? mesh, 'vertex');
  const triangles = children(children(mesh, 'triangles')[0] ?? mesh, 'triangle');
  if (!vertices.length || !triangles.length) return null;

  const positions: number[] = [];
  vertices.forEach((vertex) => {
    ['x', 'y', 'z'].forEach((axis) => {
      const value = Number(vertex.attrs[axis]);
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
  const flip = determinant3(matrix) < 0;
  const buckets = new Map<string, number[]>();

  for (const triangle of triangles) {
    const tri = ['v1', 'v2', 'v3'].map((key) => {
      const value = Number(triangle.attrs[key]);
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

  const lists = Array.from(buckets.values());
  const index = new Uint32Array(lists.reduce((sum, list) => sum + list.length, 0));
  const ranges: MeshData['groups'] = [];
  let start = 0;
  lists.forEach((list) => {
    ranges.push({ start, count: list.length });
    index.set(list, start);
    start += list.length;
  });
  const array = new Float32Array(positions);
  applyToPositions(matrix, array);
  return { positions: array, index, groups: ranges, colours: Array.from(buckets.keys()) };
};

export const transferables = (plates: PlateData[]): ArrayBuffer[] =>
  plates.flatMap((plate) =>
    plate.flatMap((mesh) => [mesh.positions.buffer, mesh.index.buffer] as ArrayBuffer[]),
  );

export const parseThreeMf = (buffer: ArrayBuffer): PlateData[] => {
  const files = unzipSync(new Uint8Array(buffer));
  const docs = new Map<string, XmlNode>();
  const read = (path: string) => {
    let doc = docs.get(path);
    if (!doc) {
      const bytes = files[path];
      if (!bytes) throw new Error(`Missing ${path}`);
      doc = parseBytes(bytes);
      docs.set(path, doc);
    }
    return doc;
  };

  let rootPath = DEFAULT_MODEL;
  if (files['_rels/.rels']) {
    const rels = children(parseBytes(files['_rels/.rels']), 'Relationship');
    const target = rels.find((rel) => rel.attrs.Type?.endsWith('/3dmodel'))?.attrs.Target;
    if (target) rootPath = strip(target);
  }

  const parts = new Map<string, Map<string, XmlNode>>();
  const objects = (path: string) => {
    let part = parts.get(path);
    if (!part) {
      const resources = children(read(path), 'resources')[0];
      part = new Map(
        (resources ? children(resources, 'object') : []).map((object) => [object.attrs.id ?? '', object]),
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
  const plates: PlateData[] = [];
  let triangleCount = 0;

  const walk = (
    plate: PlateData,
    id: string | null,
    path: string,
    matrix: Matrix,
    depth: number,
    config: Config,
    extruder: number,
  ) => {
    if (depth > MAX_DEPTH) throw new Error('Components nested too deeply');
    const object = objects(path).get(id ?? '');
    if (!object) throw new Error(`Missing object ${id} in ${path}`);

    const mesh = children(object, 'mesh')[0];
    if (mesh) {
      const built = buildMesh(mesh, matrix, { groups: groupsOf(path), object, extruder, filaments });
      if (built) {
        triangleCount += built.index.length / 3;
        plate.push(built);
      }
    }
    const components = children(object, 'components')[0];
    if (components) {
      for (const component of children(components, 'component')) {
        const next = attribute(component, 'path');
        const part = attribute(component, 'objectid');
        walk(
          plate,
          part,
          next ? strip(next) : path,
          multiply(matrix, readTransform(attribute(component, 'transform'))),
          depth + 1,
          config,
          config.parts.get(part ?? '') ?? extruder,
        );
      }
    }
  };

  const { plates: plateOf, configs } = readSettings(files[SETTINGS]);
  const instances = new Map<string, number>();
  const build = children(read(rootPath), 'build')[0];
  for (const item of build ? children(build, 'item') : []) {
    const id = attribute(item, 'objectid') ?? '';
    const instance = instances.get(id) ?? 0;
    instances.set(id, instance + 1);
    const index = plateOf.get(`${id}:${instance}`) ?? 0;
    const plate = (plates[index] ??= []);
    const path = attribute(item, 'path');
    const config = configs.get(id) ?? { extruder: 1, parts: new Map<string, number>() };
    const transform = readTransform(attribute(item, 'transform'));
    walk(plate, id, path ? strip(path) : rootPath, transform, 0, config, config.extruder);
  }

  if (!triangleCount) throw new Error('No triangles in model');
  return plates.filter((plate) => plate.length);
};
