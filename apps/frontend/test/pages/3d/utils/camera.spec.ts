import { cameraDistance, MARGIN, placeCamera, VIEW } from '@/pages/3d/utils/camera';
import { PerspectiveCamera } from 'three';

const extent = { radius: 1, height: 2 };
const reach = extent.radius + extent.height / 2;

describe('cameraDistance', () => {
  it('should use the vertical field of view for a wide aspect', () => {
    const half = (45 * Math.PI) / 360;
    expect(cameraDistance(extent, 45, 2)).toBeCloseTo((reach * MARGIN) / Math.sin(half));
  });

  it('should be further away for a narrow aspect', () => {
    expect(cameraDistance(extent, 45, 0.5)).toBeGreaterThan(cameraDistance(extent, 45, 1));
  });

  it('should scale with the margin', () => {
    expect(cameraDistance(extent, 45, 1, MARGIN / 2)).toBeCloseTo(cameraDistance(extent, 45, 1) / 2);
  });
});

describe('placeCamera', () => {
  it('should place the camera along the view direction and enable the view offset', () => {
    const camera = new PerspectiveCamera(45, 1);
    placeCamera(camera, extent, 100, 100);
    const distance = cameraDistance(extent, 45, 1);
    expect(camera.position.length()).toBeCloseTo(distance);
    expect(camera.position.clone().normalize().distanceTo(VIEW)).toBeCloseTo(0);
    expect(camera.view?.enabled).toBe(true);
  });
});
