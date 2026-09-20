import FooterViewCounter from '@/features/footer/footer-view-counter';
import '@/locales/i18n';
import { render, screen, waitFor } from '@testing-library/react';

const mockFetch = (body: unknown, ok = true) => {
  const fetchMock = vi.fn().mockResolvedValue({ ok, json: () => Promise.resolve(body) });
  vi.stubGlobal('fetch', fetchMock);
  return fetchMock;
};

describe('FooterViewCounter', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.unstubAllEnvs();
  });

  it('should show the visitor number and the total', async () => {
    mockFetch({ number: 42, total: 1337 });
    render(<FooterViewCounter />);
    expect(await screen.findByText(/visitor number 42 of 1,337/)).toBeTruthy();
  });

  it('should render nothing when the visitor has no number', async () => {
    const fetchMock = mockFetch({ number: null, total: 7 });
    render(<FooterViewCounter />);
    await waitFor(() => expect(fetchMock).toHaveBeenCalled());
    expect(screen.queryByText(/visitor/)).toBeNull();
  });

  it('should render nothing when the API fails', async () => {
    const fetchMock = mockFetch({ error: 'Internal server error' }, false);
    render(<FooterViewCounter />);
    await waitFor(() => expect(fetchMock).toHaveBeenCalled());
    expect(screen.queryByText(/visitor/)).toBeNull();
  });

  it('should render nothing when the payload is malformed', async () => {
    const fetchMock = mockFetch({ number: 1 });
    render(<FooterViewCounter />);
    await waitFor(() => expect(fetchMock).toHaveBeenCalled());
    expect(screen.queryByText(/visitor/)).toBeNull();
  });

  it('should only read while dev is proxied to the live site', async () => {
    const fetchMock = mockFetch({ number: 1, total: 1 });
    render(<FooterViewCounter />);
    await waitFor(() => expect(fetchMock).toHaveBeenCalledWith('/api/visitors', { method: 'GET' }));
  });

  it('should register the visit against a local API', async () => {
    vi.stubEnv('VITE_API_URL', 'http://localhost:3333');
    const fetchMock = mockFetch({ number: 1, total: 1 });
    render(<FooterViewCounter />);
    await waitFor(() => expect(fetchMock).toHaveBeenCalledWith('/api/visitors', { method: 'POST' }));
  });
});
