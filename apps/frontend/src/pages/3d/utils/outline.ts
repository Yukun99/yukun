import { itemOf } from '@/pages/3d/utils/items';
import {
  BackSide,
  Box3,
  BufferGeometry,
  Mesh,
  type Object3D,
  ShaderMaterial,
  Vector3,
} from 'three';

const NAME = 'outline';
const WIDTH = 0.004;
const VERTEX = `
uniform float width;
void main() {
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position + normalize(normal) * width, 1.0);
}`;
const FRAGMENT = 'void main() { gl_FragColor = vec4(1.0); }';

const hull = (mesh: Mesh, width: number) => {
  const geometry = new BufferGeometry();
  geometry.setAttribute('position', mesh.geometry.getAttribute('position'));
  geometry.setIndex(mesh.geometry.getIndex());
  geometry.computeVertexNormals();
  const material = new ShaderMaterial({
    uniforms: { width: { value: width } },
    vertexShader: VERTEX,
    fragmentShader: FRAGMENT,
    side: BackSide,
    depthWrite: false,
  });
  const outline = new Mesh(geometry, material);
  outline.name = NAME;
  // drawn first without depth, so every mesh paints over it and only the silhouette is left
  outline.renderOrder = -1;
  outline.raycast = () => undefined;
  return outline;
};

// the position and index buffers belong to the selected mesh, so they are detached before disposal
const dispose = (outline: Mesh) => {
  outline.geometry.deleteAttribute('position');
  outline.geometry.setIndex(null);
  outline.geometry.dispose();
  (outline.material as ShaderMaterial).dispose();
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
        mesh.add(hull(mesh, width));
      }
    }
  }
};
