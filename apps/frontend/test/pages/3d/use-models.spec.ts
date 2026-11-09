import useModels from '@/pages/3d/use-models';
import { act, renderHook, waitFor } from '@testing-library/react';

const res = (body: unknown, status = 200) => ({
  ok: status >= 200 && status < 300,
  status,
  json: () => Promise.resolve(body),
});

const first = { id: 1, name: 'first', link: '', size: 4, createdAt: 1, updatedAt: 1, thumbnail: false, source: false };
const second = { id: 2, name: 'second', link: '', size: 4, createdAt: 2, updatedAt: 2, thumbnail: false, source: false };

const HEADERS = { 'Content-Type': 'application/octet-stream', Authorization: 'Bearer token' };

const stubFetch = (...responses: ReturnType<typeof res>[]) => {
  const fetchMock = vi.fn();
  responses.forEach((r) => fetchMock.mockResolvedValueOnce(r));
  vi.stubGlobal('fetch', fetchMock);
  return fetchMock;
};

const load = async (token: string | null = 'token', onUnauthorized = vi.fn()) => {
  const { result } = renderHook(() => useModels(token, onUnauthorized));
  await waitFor(() => expect(result.current.ready).toBe(true));
  return result;
};

const upload = async (
  result: Awaited<ReturnType<typeof load>>,
  thumbnail: ArrayBuffer | null,
  source: ArrayBuffer | null,
  link = '',
) => {
  let ok = false;
  await act(async () => {
    ok = await result.current.upload(new ArrayBuffer(4), 'second', link, thumbnail, source);
  });
  return ok;
};

describe('useModels', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('should load the list and select the first model', async () => {
    stubFetch(res({ models: [first, second] }));
    const result = await load(null);
    expect(result.current.models).toEqual([first, second]);
    expect(result.current.selected).toBe(1);
  });

  it('should append and select an uploaded model', async () => {
    const fetchMock = stubFetch(res({ models: [first] }), res(second, 201));
    const result = await load();

    expect(await upload(result, null, null, 'https://makerworld.com/x')).toBe(true);
    expect(result.current.models).toEqual([first, second]);
    expect(result.current.selected).toBe(2);
    const [url, init] = fetchMock.mock.calls[1];
    expect(url).toBe('/api/models?name=second&link=https%3A%2F%2Fmakerworld.com%2Fx');
    expect(init.method).toBe('POST');
    expect(init.headers).toEqual(HEADERS);
  });

  it('should send the thumbnail after the model and mark it', async () => {
    const fetchMock = stubFetch(res({ models: [first] }), res(second, 201), res(null, 204));
    const result = await load();
    const thumbnail = new ArrayBuffer(8);

    expect(await upload(result, thumbnail, null)).toBe(true);
    expect(result.current.models).toEqual([first, { ...second, thumbnail: true }]);
    const [url, init] = fetchMock.mock.calls[2];
    expect(url).toBe('/api/models/2/thumbnail');
    expect(init.method).toBe('PUT');
    expect(init.headers).toEqual(HEADERS);
    expect(init.body).toBe(thumbnail);
  });

  it('should skip the thumbnail request when there is none', async () => {
    const fetchMock = stubFetch(res({ models: [first] }), res(second, 201));
    const result = await load();

    await upload(result, null, null);

    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it('should keep the model when the thumbnail upload fails', async () => {
    stubFetch(res({ models: [first] }), res(second, 201), res({}, 500));
    const result = await load();

    expect(await upload(result, new ArrayBuffer(8), null)).toBe(true);
    expect(result.current.models).toEqual([first, second]);
  });

  it('should send the source after the thumbnail and mark it', async () => {
    const fetchMock = stubFetch(
      res({ models: [first] }),
      res(second, 201),
      res(null, 204),
      res(null, 204),
    );
    const result = await load();
    const source = new ArrayBuffer(16);

    await upload(result, new ArrayBuffer(8), source);

    expect(result.current.models).toEqual([first, { ...second, thumbnail: true, source: true }]);
    const [url, init] = fetchMock.mock.calls[3];
    expect(url).toBe('/api/models/2/source');
    expect(init.method).toBe('PUT');
    expect(init.headers).toEqual(HEADERS);
    expect(init.body).toBe(source);
  });

  it('should skip the source request when there is none', async () => {
    const fetchMock = stubFetch(res({ models: [first] }), res(second, 201), res(null, 204));
    const result = await load();

    await upload(result, new ArrayBuffer(8), null);

    expect(fetchMock).toHaveBeenCalledTimes(3);
  });

  it('should keep the model when the source upload fails', async () => {
    stubFetch(res({ models: [first] }), res(second, 201), res({}, 500));
    const result = await load();

    expect(await upload(result, null, new ArrayBuffer(8))).toBe(true);
    expect(result.current.models).toEqual([first, second]);
  });

  it('should call onUnauthorized when the upload is refused', async () => {
    const onUnauthorized = vi.fn();
    stubFetch(res({ models: [first] }), res({}, 401));
    const result = await load('token', onUnauthorized);

    expect(await upload(result, null, null)).toBe(false);
    expect(onUnauthorized).toHaveBeenCalledOnce();
    expect(result.current.models).toEqual([first]);
  });

  it('should keep the model and sign out when the thumbnail is refused', async () => {
    const onUnauthorized = vi.fn();
    stubFetch(res({ models: [first] }), res(second, 201), res({}, 403));
    const result = await load('token', onUnauthorized);

    expect(await upload(result, new ArrayBuffer(8), null)).toBe(true);
    expect(onUnauthorized).toHaveBeenCalledOnce();
    expect(result.current.models).toEqual([first, second]);
  });

  it('should replace the entry and send a PATCH with the new name and link', async () => {
    const renamed = { ...first, name: 'renamed', link: 'https://makerworld.com/x', updatedAt: 9 };
    const fetchMock = stubFetch(res({ models: [first, second] }), res(renamed));
    const result = await load();

    let ok = false;
    await act(async () => {
      ok = await result.current.update(1, 'renamed', 'https://makerworld.com/x');
    });

    expect(ok).toBe(true);
    expect(result.current.models).toEqual([renamed, second]);
    const [url, init] = fetchMock.mock.calls[1];
    expect(url).toBe('/api/models/1');
    expect(init.method).toBe('PATCH');
    expect(init.headers).toEqual({ ...HEADERS, 'Content-Type': 'application/json' });
    expect(JSON.parse(init.body)).toEqual({ name: 'renamed', link: 'https://makerworld.com/x' });
  });

  it('should sign out and keep the list when the update is refused', async () => {
    const onUnauthorized = vi.fn();
    stubFetch(res({ models: [first] }), res({}, 403));
    const result = await load('token', onUnauthorized);

    let ok = true;
    await act(async () => {
      ok = await result.current.update(1, 'renamed', '');
    });

    expect(ok).toBe(false);
    expect(onUnauthorized).toHaveBeenCalledOnce();
    expect(result.current.models).toEqual([first]);
  });

  it('should send the file, then the thumbnail and source', async () => {
    const fetchMock = stubFetch(
      res({ models: [first] }),
      res({ ...first, updatedAt: 9 }),
      res(null, 204),
      res(null, 204),
    );
    const result = await load();
    const data = new ArrayBuffer(4);
    const thumbnail = new ArrayBuffer(8);
    const source = new ArrayBuffer(16);

    let ok = false;
    await act(async () => {
      ok = await result.current.replace(1, data, thumbnail, source);
    });

    expect(ok).toBe(true);
    const calls = fetchMock.mock.calls.slice(1).map(([url, init]) => [url, init.method, init.body]);
    expect(calls).toEqual([
      ['/api/models/1/file', 'PUT', data],
      ['/api/models/1/thumbnail', 'PUT', thumbnail],
      ['/api/models/1/source', 'PUT', source],
    ]);
    expect(fetchMock.mock.calls[1][1].headers).toEqual(HEADERS);
  });

  it('should sign out and return false when the replace is refused', async () => {
    const onUnauthorized = vi.fn();
    const fetchMock = stubFetch(res({ models: [first] }), res({}, 401));
    const result = await load('token', onUnauthorized);

    let ok = true;
    await act(async () => {
      ok = await result.current.replace(1, new ArrayBuffer(4), new ArrayBuffer(8), null);
    });

    expect(ok).toBe(false);
    expect(onUnauthorized).toHaveBeenCalledOnce();
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it('should drop a deleted model and move the selection', async () => {
    stubFetch(res({ models: [first, second] }), res(null, 204));
    const result = await load();

    let ok = false;
    await act(async () => {
      ok = await result.current.remove(1);
    });

    expect(ok).toBe(true);
    expect(result.current.models).toEqual([second]);
    expect(result.current.selected).toBe(2);
  });

  it('should call onUnauthorized when the delete is refused', async () => {
    const onUnauthorized = vi.fn();
    stubFetch(res({ models: [first] }), res({}, 403));
    const result = await load('token', onUnauthorized);

    let ok = true;
    await act(async () => {
      ok = await result.current.remove(1);
    });

    expect(ok).toBe(false);
    expect(onUnauthorized).toHaveBeenCalledOnce();
    expect(result.current.models).toEqual([first]);
  });
});
