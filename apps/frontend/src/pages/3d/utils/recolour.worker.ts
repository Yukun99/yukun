import {
  recolourThreeMf,
  type RecolourRequest,
  type RecolourResult,
} from '@/pages/3d/utils/recolour';

const reply = (result: RecolourResult, transfer: ArrayBuffer[] = []) =>
  postMessage(result, { transfer });

onmessage = ({ data }: MessageEvent<RecolourRequest>) => {
  try {
    const buffer = recolourThreeMf(data.buffer, data.mapping);
    reply({ buffer }, [buffer]);
  } catch (error) {
    reply({ error: error instanceof Error ? error.message : 'Could not recolour this file' });
  }
};
