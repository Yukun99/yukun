import { type Extent, MARGIN, placeCamera } from '@/pages/3d/utils/camera';
import { MAX_THUMBNAIL, THUMBNAIL_SIZE } from '@/pages/3d/utils/models';
import { AMBIENT, DIRECTIONAL } from '@/pages/3d/utils/scene';
import {
  AmbientLight,
  Box3,
  DirectionalLight,
  Group,
  NoToneMapping,
  type Object3D,
  PerspectiveCamera,
  Scene,
  Sphere,
  Vector3,
  WebGLRenderer,
} from 'three';

const FILL = 0.92;

const toPng = (canvas: HTMLCanvasElement) =>
  new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/png'));

const projectedExtent = (camera: PerspectiveCamera, box: Box3) => {
  let extent = 0;
  for (let i = 0; i < 8; i++) {
    const corner = new Vector3(
      i & 1 ? box.max.x : box.min.x,
      i & 2 ? box.max.y : box.min.y,
      i & 4 ? box.max.z : box.min.z,
    ).project(camera);
    extent = Math.max(extent, Math.abs(corner.x), Math.abs(corner.y));
  }
  return extent;
};

// the bounding sphere leaves flat models small, so pull in until the box's corners fill the frame
const fitCamera = (camera: PerspectiveCamera, box: Box3, extent: Extent) => {
  let margin = MARGIN;
  for (let i = 0; i < 3; i++) {
    placeCamera(camera, extent, THUMBNAIL_SIZE, THUMBNAIL_SIZE, margin);
    margin *= projectedExtent(camera, box) / FILL;
  }
};

export const renderThumbnail = async (object: Object3D): Promise<ArrayBuffer | null> => {
  const clone = object.clone();
  clone.updateMatrixWorld(true);
  const box = new Box3().setFromObject(clone);
  if (box.isEmpty()) return null;
  const centre = box.getCenter(new Vector3());
  const holder = new Group();
  holder.position.set(-centre.x, -box.min.y, -centre.z);
  holder.add(clone);
  holder.updateMatrixWorld(true);

  const scene = new Scene();
  scene.add(new AmbientLight(0xffffff, AMBIENT));
  DIRECTIONAL.forEach(({ position, intensity }) => {
    const light = new DirectionalLight(0xffffff, intensity);
    light.position.set(...position);
    scene.add(light);
  });
  scene.add(holder);

  let renderer: WebGLRenderer;
  try {
    renderer = new WebGLRenderer({ alpha: true, antialias: true, preserveDrawingBuffer: true });
  } catch {
    return null;
  }
  try {
    renderer.setPixelRatio(2);
    renderer.setSize(THUMBNAIL_SIZE, THUMBNAIL_SIZE);
    renderer.setClearColor(0, 0);
    renderer.toneMapping = NoToneMapping;
    const camera = new PerspectiveCamera(45, 1, 0.1, 100);
    const extent = {
      radius: box.getBoundingSphere(new Sphere()).radius,
      height: box.max.y - box.min.y,
    };
    fitCamera(camera, new Box3().setFromObject(holder), extent);
    renderer.render(scene, camera);
    const blob = await toPng(renderer.domElement);
    if (!blob) return null;
    const bytes = await blob.arrayBuffer();
    return bytes.byteLength > 0 && bytes.byteLength <= MAX_THUMBNAIL ? bytes : null;
  } catch {
    return null;
  } finally {
    renderer.dispose();
    renderer.forceContextLoss();
  }
};
