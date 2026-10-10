import '@/locales/i18n';
import useEditor, { TOKEN_KEY } from '@/features/auth/use-editor';
import { act, renderHook } from '@testing-library/react';
import { OWNER, seedSession } from './helpers';

const mockUserinfo = (email: string, ok = true, verified = true) =>
  vi.stubGlobal(
    'fetch',
    vi.fn().mockResolvedValue({
      ok,
      json: () => Promise.resolve({ email, email_verified: verified }),
    }),
  );

describe('useEditor', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    sessionStorage.clear();
  });

  it('should not be an editor by default', () => {
    const { result } = renderHook(() => useEditor());
    expect(result.current.editor).toBe(false);
    expect(result.current.token).toBeNull();
  });

  it('should accept and store the owner session', async () => {
    mockUserinfo(OWNER);
    const { result } = renderHook(() => useEditor());
    await act(() => result.current.signIn('access', 3600));
    expect(result.current.editor).toBe(true);
    expect(result.current.email).toBe(OWNER);
    expect(result.current.token).toBe('access');
    expect(JSON.parse(sessionStorage.getItem(TOKEN_KEY) ?? '{}').token).toBe('access');
  });

  it('should reject another account without storing', async () => {
    mockUserinfo('other@example.com');
    const { result } = renderHook(() => useEditor());
    await act(() => result.current.signIn('access', 3600));
    expect(result.current.rejected).toBe(true);
    expect(result.current.editor).toBe(false);
    expect(sessionStorage.getItem(TOKEN_KEY)).toBeNull();
  });

  it('should reject when the userinfo request fails', async () => {
    mockUserinfo(OWNER, false);
    const { result } = renderHook(() => useEditor());
    await act(() => result.current.signIn('access', 3600));
    expect(result.current.rejected).toBe(true);
    expect(sessionStorage.getItem(TOKEN_KEY)).toBeNull();
  });

  it('should drop an expired stored session', () => {
    seedSession(OWNER, Date.now() - 10);
    const { result } = renderHook(() => useEditor());
    expect(result.current.token).toBeNull();
    expect(sessionStorage.getItem(TOKEN_KEY)).toBeNull();
  });

  it('should restore a live stored session and clear it on sign out', () => {
    seedSession(OWNER);
    const { result } = renderHook(() => useEditor());
    expect(result.current.editor).toBe(true);
    act(() => result.current.signOut());
    expect(result.current.editor).toBe(false);
    expect(sessionStorage.getItem(TOKEN_KEY)).toBeNull();
  });

  it('should reject an unverified email', async () => {
    mockUserinfo(OWNER, true, false);
    const { result } = renderHook(() => useEditor());
    await act(() => result.current.signIn('access', 3600));
    expect(result.current.rejected).toBe(true);
    expect(result.current.editor).toBe(false);
  });

  it('should ignore a userinfo response that arrives after sign out', async () => {
    let resolve: (value: unknown) => void = () => undefined;
    vi.stubGlobal('fetch', vi.fn().mockReturnValue(new Promise((r) => (resolve = r))));
    const { result } = renderHook(() => useEditor());
    let pending: Promise<void> = Promise.resolve();
    act(() => {
      pending = result.current.signIn('access', 3600);
    });
    act(() => result.current.signOut());
    resolve({ ok: true, json: () => Promise.resolve({ email: OWNER, email_verified: true }) });
    await act(() => pending);
    expect(result.current.editor).toBe(false);
    expect(sessionStorage.getItem(TOKEN_KEY)).toBeNull();
  });

  it('should sign out once the session expires', () => {
    vi.useFakeTimers();
    try {
      seedSession(OWNER, Date.now() + 1000);
      const { result } = renderHook(() => useEditor());
      expect(result.current.editor).toBe(true);
      act(() => vi.advanceTimersByTime(1000));
      expect(result.current.editor).toBe(false);
    } finally {
      vi.useRealTimers();
    }
  });
});
