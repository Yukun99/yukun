import { itemOf } from '@/pages/3d/utils/items';
import {
  BackSide,
  Box3,
  BufferGeometry,
  Mesh,
  NotEqualStencilFunc,
  type Object3D,
  ReplaceStencilOp,
  ShaderMaterial,
  Vector3,
} from 'three';

const NAME = 'outline';
const WIDTH = 0.004;
const REFS = 255;
const VERTEX = `
uniform float width;
void main() {
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position + normalize(normal) * width, 1.0);
}`;
const FLAT = 'void main() { gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }';
const FRAGMENT = 'void main() { gl_FragColor = vec4(1.0); }';

const overlay = (geometry: BufferGeometry, material: ShaderMaterial, order: number) => {
  const mesh = new Mesh(geometry, material);
  mesh.name = NAME;
  mesh.renderOrder = order;
  mesh.raycast = () => undefined;
  return mesh;
};

// the mask stencils the visible part of the item, so the hull only shows as a silhouette around it
const hull = (mesh: Mesh, width: number, item: number) => {
  const geometry = new BufferGeometry();
  geometry.setAttribute('position', mesh.geometry.getAttribute('position'));
  geometry.setIndex(mesh.geometry.getIndex());
  geometry.computeVertexNormals();
  const stencil = { transparent: true, depthWrite: false, stencilRef: (item % REFS) + 1 };
  // the bias keeps the mask from z-fighting with the surface it copies
  const mask = new ShaderMaterial({
    vertexShader: FLAT,
    fragmentShader: FRAGMENT,
    colorWrite: false,
    polygonOffset: true,
    polygonOffsetFactor: -2,
    polygonOffsetUnits: -2,
    stencilWrite: true,
    stencilZPass: ReplaceStencilOp,
    ...stencil,
  });
  const edge = new ShaderMaterial({
    uniforms: { width: { value: width } },
    vertexShader: VERTEX,
    fragmentShader: FRAGMENT,
    side: BackSide,
    stencilWrite: true,
    stencilFunc: NotEqualStencilFunc,
    ...stencil,
  });
  // both draw after the model, and the depth test hides the hull behind anything nearer
  const outline = overlay(geometry, edge, 2);
  outline.add(overlay(geometry, mask, 1));
  return outline;
};

// the position and index buffers belong to the selected mesh, so they are detached before disposal
const dispose = (outline: Mesh) => {
  outline.geometry.deleteAttribute('position');
  outline.geometry.setIndex(null);
  outline.geometry.dispose();
  outline.traverse((node) => node instanceof Mesh && (node.material as ShaderMaterial).dispose());
};

// an inverted hull per selected mesh keeps the shared colour materials untouched
export const syncOutlines = (plates: Object3D[], selected: ReadonlySet<number>) => {
  for (const plate of plates) {
    const meshes: Mesh[] = [];
    plate.traverse((node) => node instanceof Mesh && node.name !== NAME && meshes.push(node));
    let width = 0;
    for (const mesh of meshes) {
      const item = itemOf(mesh);
      const wanted = item !== null && selected.has(item);
      const existing = mesh.children.find((child) => child.name === NAME);
      if (existing instanceof Mesh && !wanted) {
        mesh.remove(existing);
        dispose(existing);
      } else if (!existing && wanted) {
        width ||= new Box3().setFromObject(plate).getSize(new Vector3()).length() * WIDTH;
        mesh.add(hull(mesh, width, item));
      }
    }
  }
};
