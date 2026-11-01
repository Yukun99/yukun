import { remapPaint } from '@/pages/3d/utils/paint';
import { recolourBambu, recolourLayers, recolourModelSettings } from '@/pages/3d/utils/recolour-bambu';
import { recolourMaterials } from '@/pages/3d/utils/recolour-materials';
import { runWorker } from '@/pages/3d/utils/worker';
import { strFromU8, strToU8, unzipSync, zipSync } from 'three/examples/jsm/libs/fflate.module.js';

const PROJECT = 'Metadata/project_settings.config';
const SETTINGS = 'Metadata/model_settings.config';
const LAYERS = ['Metadata/layer_config_ranges.xml', 'Metadata/custom_gcode_per_layer.xml'];
const TRIANGLE = /<triangle\b[^>]*>/g;
const PAINT = /(?<=\s)(paint_color|mmu_segmentation)=(["'])([^"']*)\2/g;

export type RecolourRequest = { buffer: ArrayBuffer; mapping: Record<string, string> };
export type RecolourResult = { buffer: ArrayBuffer } | { error: string };

const remapTriangles = (text: string, index: (state: number) => number) =>
  text.replace(TRIANGLE, (tag) =>
    tag.replace(PAINT, (whole, name: string, quote: string, paint: string) => {
      const next = remapPaint(paint, index);
      return next === null ? whole : `${name}=${quote}${next}${quote}`;
    }),
  );

const parseProject = (bytes: Uint8Array | undefined) => {
  if (!bytes) return null;
  try {
    const project = JSON.parse(strFromU8(bytes));
    return typeof project === 'object' && project !== null && Array.isArray(project.filament_colour)
      ? (project as Record<string, unknown>)
      : null;
  } catch {
    return null;
  }
};

const rewrite = (bytes: Uint8Array<ArrayBuffer>, edit: (text: string) => string) => {
  const text = strFromU8(bytes);
  const next = edit(text);
  return next === text ? bytes : new Uint8Array(strToU8(next));
};

export const recolourThreeMf = (buffer: ArrayBuffer, mapping: Record<string, string>) => {
  const files = unzipSync(new Uint8Array(buffer));
  const settings = parseProject(files[PROJECT]);
  const bambu = settings && recolourBambu(settings, mapping);
  if (bambu?.changed) {
    files[PROJECT] = new Uint8Array(strToU8(JSON.stringify(bambu.project, null, 4)));
  }
  const merged = bambu?.merged ? bambu : null;
  if (merged && files[SETTINGS]) {
    files[SETTINGS] = rewrite(files[SETTINGS], (text) =>
      recolourModelSettings(text, merged.index, merged.keep),
    );
  }
  for (const path of LAYERS) {
    if (merged && files[path]) files[path] = rewrite(files[path], (text) => recolourLayers(text, merged.index));
  }
  for (const [path, bytes] of Object.entries(files)) {
    if (!path.endsWith('.model')) continue;
    files[path] = rewrite(bytes, (text) => {
      const next = recolourMaterials(text, mapping);
      return merged ? remapTriangles(next, merged.index) : next;
    });
  }
  const zipped = zipSync(files);
  return zipped.buffer.slice(zipped.byteOffset, zipped.byteOffset + zipped.byteLength) as ArrayBuffer;
};

export const recolourInWorker = async (
  buffer: ArrayBuffer,
  mapping: Record<string, string>,
  signal?: AbortSignal,
): Promise<ArrayBuffer> => {
  const result = await runWorker<RecolourRequest, RecolourResult>(
    () => new Worker(new URL('./recolour.worker.ts', import.meta.url), { type: 'module' }),
    { buffer, mapping },
    [buffer],
    signal,
  );
  if ('error' in result) throw new Error(result.error);
  return result.buffer;
};
