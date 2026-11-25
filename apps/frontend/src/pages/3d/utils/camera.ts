import { type PerspectiveCamera, Vector3 } from 'three';

export const VIEW = new Vector3(0.6, 0.4, 1).normalize();
export const MARGIN = 1.1;

export const cameraDistance = (radius: number, fov: number, aspect: number, margin = MARGIN) => {
  const vertical = (fov * Math.PI) / 180;
  const horizontal = 2 * Math.atan(Math.tan(vertical / 2) * aspect);
  return (radius * margin) / Math.sin(Math.min(vertical, horizontal) / 2);
};

export const placeCamera = (
  camera: PerspectiveCamera,
  radius: number,
  aspect: number,
  margin = MARGIN,
) => {
  const distance = cameraDistance(radius, camera.fov, aspect, margin);
  camera.position.copy(VIEW).multiplyScalar(distance);
  camera.near = distance / 100;
  camera.far = distance * 100;
  camera.lookAt(0, 0, 0);
  camera.clearViewOffset();
  camera.updateMatrixWorld();
};
