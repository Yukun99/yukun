import { Mesh, type Object3D } from 'three';

export const disposeObject = (object: Object3D) =>
  object.traverse((child) => {
    if (!(child instanceof Mesh)) return;
    child.geometry.dispose();
    [child.material].flat().forEach((material) => material.dispose());
  });
