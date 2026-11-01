import type { PlateData, WorkerResult } from '@/pages/3d/utils/three-mf';
import { runWorker } from '@/pages/3d/utils/worker';
import {
  BufferAttribute,
  BufferGeometry,
  Group,
  Mesh,
  MeshStandardMaterial,
} from 'three';

export const buildPlates = (plates: PlateData[]): Group[] => {
  const materials = new Map<string, MeshStandardMaterial>();
  const materialOf = (colour: string) => {
    let material = materials.get(colour);
    if (!material) {
      material = new MeshStandardMaterial({
        color: parseInt(colour, 16),
        roughness: 0.6,
        metalness: 0.05,
        flatShading: true,
      });
      materials.set(colour, material);
    }
    return material;
  };

  return plates.map((meshes) => {
    const plate = new Group();
    for (const { positions, index, groups, colours } of meshes) {
      const geometry = new BufferGeometry();
      geometry.setAttribute('position', new BufferAttribute(positions, 3));
      geometry.setIndex(new BufferAttribute(index, 1));
      groups.forEach(({ start, count }, i) => geometry.addGroup(start, count, i));
      plate.add(new Mesh(geometry, colours.map(materialOf)));
    }
    plate.rotation.x = -Math.PI / 2;
    return plate;
  });
};

export const loadThreeMf = async (buffer: ArrayBuffer, signal?: AbortSignal): Promise<Group[]> => {
  const result = await runWorker<ArrayBuffer, WorkerResult>(
    () => new Worker(new URL('./three-mf.worker.ts', import.meta.url), { type: 'module' }),
    buffer,
    [buffer],
    signal,
  );
  if ('error' in result) throw new Error(result.error);
  return buildPlates(result.plates);
};
