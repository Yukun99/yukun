import { EditorContext } from '@/common/contexts/editor-context';
import '@/locales/i18n';
import Ideas from '@/pages/ideas/ideas';
import { emptyGrid } from '@/pages/ideas/utils/ideas';
import { render, screen } from '@testing-library/react';
import { OWNER } from '../../features/auth/helpers';

describe('Ideas', () => {
  beforeEach(() => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: () => Promise.resolve({ ideas: emptyGrid() }),
      }),
    );
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('should be read-only for visitors', async () => {
    render(<Ideas />);
    expect((await screen.findAllByTestId('idea-tile')).length).toBeGreaterThan(0);
    expect(screen.queryByText('Add Row')).toBeNull();
  });

  it('should let the signed-in owner edit', async () => {
    const value = {
      enabled: true,
      token: 'access',
      email: OWNER,
      editor: true,
      rejected: false,
      signIn: () => undefined,
      signOut: () => undefined,
    };
    render(
      <EditorContext.Provider value={value}>
        <Ideas />
      </EditorContext.Provider>,
    );
    expect(await screen.findByText('Add Row')).toBeTruthy();
  });
});
