import { type Editor, EditorContext } from '@/common/contexts/editor-context';
import NavigationAuthButton from '@/features/navigation/buttons/navigation-auth-button';
import '@/locales/i18n';
import { fireEvent, render, screen } from '@testing-library/react';

const login = vi.fn();

vi.mock('@react-oauth/google', () => ({ useGoogleLogin: () => login }));

const base: Editor = {
  enabled: true,
  token: null,
  email: null,
  editor: false,
  rejected: false,
  signIn: () => undefined,
  signOut: () => undefined,
};

const renderButton = (value: Partial<Editor>, variant: 'bar' | 'drawer' = 'bar') =>
  render(
    <EditorContext.Provider value={{ ...base, ...value }}>
      <NavigationAuthButton variant={variant} />
    </EditorContext.Provider>,
  );

describe('NavigationAuthButton', () => {
  beforeEach(() => login.mockClear());

  it('should render nothing when disabled and signed out', () => {
    const { container } = renderButton({ enabled: false });
    expect(container.firstChild).toBeNull();
  });

  it('should ask for confirmation before signing in', () => {
    renderButton({});
    fireEvent.click(screen.getByText('Sign In'));
    expect(login).not.toHaveBeenCalled();
    expect(screen.getByText('Owner Sign In')).toBeTruthy();
    fireEvent.click(screen.getByText('Confirm'));
    expect(login).toHaveBeenCalledTimes(1);
  });

  it('should close the dialog on cancel without signing in', async () => {
    renderButton({}, 'drawer');
    fireEvent.click(screen.getByText('Sign In'));
    fireEvent.click(screen.getByText('Cancel'));
    expect(login).not.toHaveBeenCalled();
    await vi.waitFor(() => expect(screen.queryByText('Owner Sign In')).toBeNull());
  });

  it('should sign out the editor', () => {
    const signOut = vi.fn();
    renderButton({ editor: true, signOut });
    fireEvent.click(screen.getByText('Sign Out'));
    expect(signOut).toHaveBeenCalled();
  });

  it('should show the not-owner text when rejected', () => {
    renderButton({ rejected: true });
    expect(screen.getByText('Only the site owner can edit')).toBeTruthy();
  });
});
