import { cameraDistance, MARGIN, placeCamera, VIEW } from '@/pages/3d/utils/camera';
import { PerspectiveCamera } from 'three';

const radius = 2;

describe('cameraDistance', () => {
  it('should use the vertical field of view for a wide aspect', () => {
    const half = (45 * Math.PI) / 360;
    expect(cameraDistance(radius, 45, 2)).toBeCloseTo((radius * MARGIN) / Math.sin(half));
  });

  it('should be further away for a narrow aspect', () => {
    expect(cameraDistance(radius, 45, 0.5)).toBeGreaterThan(cameraDistance(radius, 45, 1));
  });

  it('should scale with the margin', () => {
    expect(cameraDistance(radius, 45, 1, MARGIN / 2)).toBeCloseTo(cameraDistance(radius, 45, 1) / 2);
  });
});

describe('placeCamera', () => {
  it('should place the camera along the view direction without a view offset', () => {
    const camera = new PerspectiveCamera(45, 1);
    camera.setViewOffset(100, 100, 10, 10, 100, 100);
    placeCamera(camera, radius, 1);
    const distance = cameraDistance(radius, 45, 1);
    expect(camera.position.length()).toBeCloseTo(distance);
    expect(camera.position.clone().normalize().distanceTo(VIEW)).toBeCloseTo(0);
    expect(camera.view?.enabled).toBe(false);
  });
});
