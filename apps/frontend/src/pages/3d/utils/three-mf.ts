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

const buildGeometry = (mesh: Element, matrix: Matrix4) => {
  const vertices = children(children(mesh, 'vertices')[0] ?? mesh, 'vertex');
  const triangles = children(children(mesh, 'triangles')[0] ?? mesh, 'triangle');
  if (!vertices.length || !triangles.length) return null;

  const positions = new Float32Array(vertices.length * 3);
  vertices.forEach((vertex, i) => {
    ['x', 'y', 'z'].forEach((axis, j) => {
      const value = Number(vertex.getAttribute(axis));
      if (!Number.isFinite(value)) throw new Error('Invalid vertex');
      positions[i * 3 + j] = value;
    });
  });
  const flip = matrix.determinant() < 0;
  const indices = new Uint32Array(triangles.length * 3);
  triangles.forEach((triangle, i) => {
    (flip ? ['v1', 'v3', 'v2'] : ['v1', 'v2', 'v3']).forEach((key, j) => {
      const value = Number(triangle.getAttribute(key));
      if (!Number.isInteger(value) || value < 0 || value >= vertices.length) {
        throw new Error('Invalid triangle');
      }
      indices[i * 3 + j] = value;
    });
  });

  const geometry = new BufferGeometry();
  geometry.setAttribute('position', new BufferAttribute(positions, 3));
  geometry.setIndex(new BufferAttribute(indices, 1));
  geometry.applyMatrix4(matrix);
  return geometry;
};

// Bambu Studio lists which build item (object id + instance) sits on which plate
const readPlates = (bytes: Uint8Array | undefined) => {
  const plates = new Map<string, number>();
  if (!bytes) return plates;
  const metadata = (element: Element, key: string) =>
    children(element, 'metadata').find((meta) => meta.getAttribute('key') === key)?.getAttribute('value');
  children(parseXml(bytes).documentElement, 'plate').forEach((plate, index) => {
    for (const instance of children(plate, 'model_instance')) {
      plates.set(`${metadata(instance, 'object_id')}:${metadata(instance, 'instance_id') ?? 0}`, index);
    }
  });
  return plates;
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

  const material = new MeshStandardMaterial({ color: 0xbfbfbf, roughness: 0.6, metalness: 0.05, flatShading: true });
  const plates: Group[] = [];
  let triangleCount = 0;

  const walk = (group: Group, id: string | null, path: string, matrix: Matrix4, depth: number) => {
    if (depth > MAX_DEPTH) throw new Error('Components nested too deeply');
    const object = objects(path).get(id ?? '');
    if (!object) throw new Error(`Missing object ${id} in ${path}`);

    const mesh = children(object, 'mesh')[0];
    if (mesh) {
      const geometry = buildGeometry(mesh, matrix);
      if (geometry) {
        triangleCount += (geometry.getIndex()?.count ?? 0) / 3;
        group.add(new Mesh(geometry, material));
      }
    }
    const components = children(object, 'components')[0];
    if (components) {
      for (const component of children(components, 'component')) {
        const next = attribute(component, 'path');
        walk(
          group,
          attribute(component, 'objectid'),
          next ? strip(next) : path,
          matrix.clone().multiply(readTransform(attribute(component, 'transform'))),
          depth + 1,
        );
      }
    }
  };

  const plateOf = readPlates(files[SETTINGS]);
  const instances = new Map<string, number>();
  const build = children(read(rootPath).documentElement, 'build')[0];
  for (const item of build ? children(build, 'item') : []) {
    const id = attribute(item, 'objectid') ?? '';
    const instance = instances.get(id) ?? 0;
    instances.set(id, instance + 1);
    const index = plateOf.get(`${id}:${instance}`) ?? 0;
    const group = (plates[index] ??= new Group());
    const path = attribute(item, 'path');
    walk(group, id, path ? strip(path) : rootPath, readTransform(attribute(item, 'transform')), 0);
  }

  if (!triangleCount) throw new Error('No triangles in model');
  const filled = plates.filter((plate) => plate.children.length);
  filled.forEach((plate) => (plate.rotation.x = -Math.PI / 2));
  return filled;
};
