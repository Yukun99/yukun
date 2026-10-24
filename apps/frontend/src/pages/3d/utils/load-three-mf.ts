import type { PlateData, WorkerResult } from '@/pages/3d/utils/three-mf';
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

export const loadThreeMf = (buffer: ArrayBuffer, signal?: AbortSignal): Promise<Group[]> =>
  new Promise((resolve, reject) => {
    if (signal?.aborted) {
      reject(signal.reason);
      return;
    }
    const worker = new Worker(new URL('./three-mf.worker.ts', import.meta.url), {
      type: 'module',
    });
    const settle = (finish: () => void) => {
      signal?.removeEventListener('abort', onAbort);
      worker.terminate();
      try {
        finish();
      } catch (error) {
        reject(error);
      }
    };
    const onAbort = () => settle(() => reject(signal?.reason));
    signal?.addEventListener('abort', onAbort);
    worker.onmessage = ({ data }: MessageEvent<WorkerResult>) =>
      settle(() => {
        if ('error' in data) throw new Error(data.error);
        resolve(buildPlates(data.plates));
      });
    worker.onerror = (event) => settle(() => reject(new Error(event.message)));
    worker.postMessage(buffer, [buffer]);
  });
