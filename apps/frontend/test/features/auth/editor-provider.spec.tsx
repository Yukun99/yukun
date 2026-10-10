import { useEditorContext } from '@/common/contexts/editor-context';
import EditorProvider from '@/features/auth/editor-provider';
import { render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';

vi.mock('@react-oauth/google', () => ({
  GoogleOAuthProvider: ({ children }: { children: ReactNode }) => children,
}));

const Probe = () => <div>{String(useEditorContext().enabled)}</div>;

describe('EditorProvider', () => {
  afterEach(() => vi.unstubAllEnvs());

  it('should be disabled without a client id', () => {
    vi.stubEnv('VITE_GOOGLE_CLIENT_ID', '');
    render(
      <EditorProvider>
        <Probe />
      </EditorProvider>,
    );
    expect(screen.getByText('false')).toBeTruthy();
  });

  it('should be enabled with a client id', () => {
    vi.stubEnv('VITE_GOOGLE_CLIENT_ID', 'x');
    render(
      <EditorProvider>
        <Probe />
      </EditorProvider>,
    );
    expect(screen.getByText('true')).toBeTruthy();
  });
});
