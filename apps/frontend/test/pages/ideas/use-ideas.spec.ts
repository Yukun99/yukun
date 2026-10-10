import useIdeas from '@/pages/ideas/use-ideas';
import { emptyGrid } from '@/pages/ideas/utils/ideas';
import { act, renderHook, waitFor } from '@testing-library/react';

const res = (body: unknown, status = 200) => ({
  ok: status >= 200 && status < 300,
  status,
  json: () => Promise.resolve(body),
});

const grid = () => {
  const g = emptyGrid();
  g[0] = { title: 'saved', content: 'idea' };
  return g;
};

const puts = (fetchMock: ReturnType<typeof vi.fn>) =>
  fetchMock.mock.calls.filter(([, init]) => init?.method === 'PUT');

describe('useIdeas', () => {
  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  it('should load the grid from the API', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(res({ ideas: grid() })));
    const { result } = renderHook(() => useIdeas(null, vi.fn()));
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.ideas[0].title).toBe('saved');
  });

  it('should fall back to the empty grid when the request fails', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('down')));
    const { result } = renderHook(() => useIdeas(null, vi.fn()));
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.ideas).toEqual(emptyGrid());
  });

  it('should fall back to the empty grid when the body is malformed', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(res({ nope: true })));
    const { result } = renderHook(() => useIdeas(null, vi.fn()));
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.ideas).toEqual(emptyGrid());
  });

  it('should send one debounced PUT with the token', async () => {
    vi.useFakeTimers();
    const fetchMock = vi.fn().mockResolvedValue(res({ ideas: emptyGrid() }));
    vi.stubGlobal('fetch', fetchMock);
    const { result } = renderHook(() => useIdeas('tok', vi.fn()));
    await act(() => vi.advanceTimersByTimeAsync(0));
    const idea = { title: 't', content: 'c' };
    act(() => result.current.setIdea(0, { title: 'x', content: 'y' }));
    act(() => result.current.setIdea(0, idea));
    await act(() => vi.advanceTimersByTimeAsync(500));
    expect(puts(fetchMock)).toHaveLength(1);
    const [url, init] = puts(fetchMock)[0];
    expect(url).toBe('/api/ideas');
    expect(init.headers.Authorization).toBe('Bearer tok');
    expect(init.headers['Content-Type']).toBe('application/json');
    expect(JSON.parse(init.body).ideas[0]).toEqual(idea);
  });

  it('should not send without a token', async () => {
    vi.useFakeTimers();
    const fetchMock = vi.fn().mockResolvedValue(res({ ideas: emptyGrid() }));
    vi.stubGlobal('fetch', fetchMock);
    const { result } = renderHook(() => useIdeas(null, vi.fn()));
    await act(() => vi.advanceTimersByTimeAsync(0));
    act(() => result.current.setIdea(0, { title: 't', content: 'c' }));
    await act(() => vi.advanceTimersByTimeAsync(500));
    expect(puts(fetchMock)).toHaveLength(0);
  });

  it('should report unauthorized and re-fetch on a 401', async () => {
    vi.useFakeTimers();
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(res({ ideas: emptyGrid() }))
      .mockResolvedValueOnce(res({ error: 'no' }, 401))
      .mockResolvedValue(res({ ideas: emptyGrid() }));
    vi.stubGlobal('fetch', fetchMock);
    const onUnauthorized = vi.fn();
    const { result } = renderHook(() => useIdeas('tok', onUnauthorized));
    await act(() => vi.advanceTimersByTimeAsync(0));
    act(() => result.current.setIdea(0, { title: 't', content: 'c' }));
    await act(() => vi.advanceTimersByTimeAsync(500));
    expect(onUnauthorized).toHaveBeenCalledTimes(1);
    expect(fetchMock).toHaveBeenCalledTimes(3);
    expect(result.current.ideas[0].title).toBe('');
  });

  it('should not allow edits until the grid has loaded', async () => {
    vi.useFakeTimers();
    const fetchMock = vi.fn().mockRejectedValue(new Error('down'));
    vi.stubGlobal('fetch', fetchMock);
    const { result } = renderHook(() => useIdeas('tok', vi.fn()));
    act(() => result.current.setIdea(0, { title: 'early', content: '' }));
    await act(() => vi.advanceTimersByTimeAsync(500));
    expect(result.current.ready).toBe(false);
    act(() => result.current.setIdea(0, { title: 'late', content: '' }));
    await act(() => vi.advanceTimersByTimeAsync(500));
    expect(result.current.ideas[0].title).toBe('');
    expect(puts(fetchMock)).toHaveLength(0);
  });

  it('should keep newer local edits and send them after an in-flight PUT', async () => {
    vi.useFakeTimers();
    let finish: (value: unknown) => void = () => undefined;
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(res({ ideas: emptyGrid() }))
      .mockReturnValueOnce(new Promise((resolve) => (finish = resolve)))
      .mockResolvedValue(res({ ideas: emptyGrid() }));
    vi.stubGlobal('fetch', fetchMock);
    const { result } = renderHook(() => useIdeas('tok', vi.fn()));
    await act(() => vi.advanceTimersByTimeAsync(0));
    act(() => result.current.setIdea(0, { title: 'first', content: '' }));
    await act(() => vi.advanceTimersByTimeAsync(500));
    act(() => result.current.setIdea(0, { title: 'second', content: '' }));
    await act(() => vi.advanceTimersByTimeAsync(500));
    expect(puts(fetchMock)).toHaveLength(1);
    await act(async () => finish(res({ ideas: emptyGrid() })));
    await act(() => vi.advanceTimersByTimeAsync(0));
    expect(result.current.ideas[0].title).toBe('second');
    expect(puts(fetchMock)).toHaveLength(2);
    expect(JSON.parse(puts(fetchMock)[1][1].body).ideas[0].title).toBe('second');
  });

  it('should flush a pending save on unmount', async () => {
    vi.useFakeTimers();
    const fetchMock = vi.fn().mockResolvedValue(res({ ideas: emptyGrid() }));
    vi.stubGlobal('fetch', fetchMock);
    const { result, unmount } = renderHook(() => useIdeas('tok', vi.fn()));
    await act(() => vi.advanceTimersByTimeAsync(0));
    act(() => result.current.setIdea(0, { title: 't', content: 'c' }));
    unmount();
    expect(puts(fetchMock)).toHaveLength(1);
  });
});
