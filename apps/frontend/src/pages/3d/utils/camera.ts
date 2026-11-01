import { type PerspectiveCamera, Vector2, Vector3 } from 'three';

export type Extent = { radius: number; height: number };

export const VIEW = new Vector3(0.6, 0.4, 1).normalize();
export const MARGIN = 1.1;

export const cameraDistance = (extent: Extent, fov: number, aspect: number, margin = MARGIN) => {
  const reach = extent.radius + extent.height / 2;
  const vertical = (fov * Math.PI) / 180;
  const horizontal = 2 * Math.atan(Math.tan(vertical / 2) * aspect);
  return (reach * margin) / Math.sin(Math.min(vertical, horizontal) / 2);
};

export const placeCamera = (
  camera: PerspectiveCamera,
  extent: Extent,
  width: number,
  height: number,
  margin = MARGIN,
) => {
  const distance = cameraDistance(extent, camera.fov, width / height, margin);
  camera.position.copy(VIEW).multiplyScalar(distance);
  camera.near = distance / 100;
  camera.far = distance * 100;
  camera.lookAt(0, 0, 0);
  camera.clearViewOffset();
  camera.updateMatrixWorld();
  const middle = new Vector3(0, extent.height / 2, 0).project(camera);
  const pan = new Vector2(0, (-middle.y * height) / 2);
  camera.setViewOffset(width, height, pan.x, pan.y, width, height);
  return pan;
};
