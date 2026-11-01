export const runWorker = <Request, Response>(
  create: () => Worker,
  message: Request,
  transfer: ArrayBuffer[],
  signal?: AbortSignal,
): Promise<Response> =>
  new Promise((resolve, reject) => {
    if (signal?.aborted) {
      reject(signal.reason);
      return;
    }
    const worker = create();
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
    worker.onmessage = ({ data }: MessageEvent<Response>) => settle(() => resolve(data));
    worker.onerror = (event) => settle(() => reject(new Error(event.message)));
    worker.postMessage(message, transfer);
  });
