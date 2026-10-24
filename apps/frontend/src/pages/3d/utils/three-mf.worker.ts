import { parseThreeMf, transferables, type WorkerResult } from '@/pages/3d/utils/three-mf';

const reply = (result: WorkerResult, transfer: ArrayBuffer[] = []) =>
  postMessage(result, { transfer });

onmessage = ({ data }: MessageEvent<ArrayBuffer>) => {
  try {
    const plates = parseThreeMf(data);
    reply({ plates }, transferables(plates));
  } catch (error) {
    reply({ error: error instanceof Error ? error.message : 'Could not read this file' });
  }
};
