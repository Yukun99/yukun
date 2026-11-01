import useModels from '@/pages/3d/use-models';
import { act, renderHook, waitFor } from '@testing-library/react';

const res = (body: unknown, status = 200) => ({
  ok: status >= 200 && status < 300,
  status,
  json: () => Promise.resolve(body),
});

const first = { id: 1, name: 'first', link: '', size: 4, createdAt: 1, thumbnail: false };
const second = { id: 2, name: 'second', link: '', size: 4, createdAt: 2, thumbnail: false };

describe('useModels', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('should load the list and select the first model', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(res({ models: [first, second] })));
    const { result } = renderHook(() => useModels(null, vi.fn()));
    await waitFor(() => expect(result.current.ready).toBe(true));
    expect(result.current.models).toEqual([first, second]);
    expect(result.current.selected).toBe(1);
  });

  it('should append and select an uploaded model', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(res({ models: [first] }))
      .mockResolvedValueOnce(res(second, 201));
    vi.stubGlobal('fetch', fetchMock);
    const { result } = renderHook(() => useModels('token', vi.fn()));
    await waitFor(() => expect(result.current.ready).toBe(true));

    let ok = false;
    await act(async () => {
      ok = await result.current.upload(
        new ArrayBuffer(4),
        'second',
        'https://makerworld.com/x',
        null,
      );
    });

    expect(ok).toBe(true);
    expect(result.current.models).toEqual([first, second]);
    expect(result.current.selected).toBe(2);
    const [url, init] = fetchMock.mock.calls[1];
    expect(url).toBe('/api/models?name=second&link=https%3A%2F%2Fmakerworld.com%2Fx');
    expect(init.method).toBe('POST');
    expect(init.headers).toEqual({
      'Content-Type': 'application/octet-stream',
      Authorization: 'Bearer token',
    });
  });

  it('should send the thumbnail after the model and mark it', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(res({ models: [first] }))
      .mockResolvedValueOnce(res(second, 201))
      .mockResolvedValueOnce(res(null, 204));
    vi.stubGlobal('fetch', fetchMock);
    const { result } = renderHook(() => useModels('token', vi.fn()));
    await waitFor(() => expect(result.current.ready).toBe(true));
    const thumbnail = new ArrayBuffer(8);

    let ok = false;
    await act(async () => {
      ok = await result.current.upload(new ArrayBuffer(4), 'second', '', thumbnail);
    });

    expect(ok).toBe(true);
    expect(result.current.models).toEqual([first, { ...second, thumbnail: true }]);
    const [url, init] = fetchMock.mock.calls[2];
    expect(url).toBe('/api/models/2/thumbnail');
    expect(init.method).toBe('PUT');
    expect(init.headers).toEqual({
      'Content-Type': 'application/octet-stream',
      Authorization: 'Bearer token',
    });
    expect(init.body).toBe(thumbnail);
  });

  it('should skip the thumbnail request when there is none', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(res({ models: [first] }))
      .mockResolvedValueOnce(res(second, 201));
    vi.stubGlobal('fetch', fetchMock);
    const { result } = renderHook(() => useModels('token', vi.fn()));
    await waitFor(() => expect(result.current.ready).toBe(true));

    await act(async () => {
      await result.current.upload(new ArrayBuffer(4), 'second', '', null);
    });

    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it('should keep the model when the thumbnail upload fails', async () => {
    vi.stubGlobal(
      'fetch',
      vi
        .fn()
        .mockResolvedValueOnce(res({ models: [first] }))
        .mockResolvedValueOnce(res(second, 201))
        .mockResolvedValueOnce(res({}, 500)),
    );
    const { result } = renderHook(() => useModels('token', vi.fn()));
    await waitFor(() => expect(result.current.ready).toBe(true));

    let ok = false;
    await act(async () => {
      ok = await result.current.upload(new ArrayBuffer(4), 'second', '', new ArrayBuffer(8));
    });

    expect(ok).toBe(true);
    expect(result.current.models).toEqual([first, second]);
  });

  it('should call onUnauthorized when the upload is refused', async () => {
    const onUnauthorized = vi.fn();
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValueOnce(res({ models: [first] })).mockResolvedValueOnce(res({}, 401)),
    );
    const { result } = renderHook(() => useModels('token', onUnauthorized));
    await waitFor(() => expect(result.current.ready).toBe(true));

    let ok = true;
    await act(async () => {
      ok = await result.current.upload(new ArrayBuffer(4), 'second', '', null);
    });

    expect(ok).toBe(false);
    expect(onUnauthorized).toHaveBeenCalledOnce();
    expect(result.current.models).toEqual([first]);
  });

  it('should keep the model and sign out when the thumbnail is refused', async () => {
    const onUnauthorized = vi.fn();
    vi.stubGlobal(
      'fetch',
      vi
        .fn()
        .mockResolvedValueOnce(res({ models: [first] }))
        .mockResolvedValueOnce(res(second, 201))
        .mockResolvedValueOnce(res({}, 403)),
    );
    const { result } = renderHook(() => useModels('token', onUnauthorized));
    await waitFor(() => expect(result.current.ready).toBe(true));

    let ok = false;
    await act(async () => {
      ok = await result.current.upload(new ArrayBuffer(4), 'second', '', new ArrayBuffer(8));
    });

    expect(ok).toBe(true);
    expect(onUnauthorized).toHaveBeenCalledOnce();
    expect(result.current.models).toEqual([first, second]);
  });

  it('should drop a deleted model and move the selection', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValueOnce(res({ models: [first, second] })).mockResolvedValueOnce(res(null, 204)),
    );
    const { result } = renderHook(() => useModels('token', vi.fn()));
    await waitFor(() => expect(result.current.ready).toBe(true));

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
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValueOnce(res({ models: [first] })).mockResolvedValueOnce(res({}, 403)),
    );
    const { result } = renderHook(() => useModels('token', onUnauthorized));
    await waitFor(() => expect(result.current.ready).toBe(true));

    let ok = true;
    await act(async () => {
      ok = await result.current.remove(1);
    });

    expect(ok).toBe(false);
    expect(onUnauthorized).toHaveBeenCalledOnce();
    expect(result.current.models).toEqual([first]);
  });
});
