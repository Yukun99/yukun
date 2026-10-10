import NavigationAuthDialog from '@/features/navigation/buttons/navigation-auth-dialog';
import '@/locales/i18n';
import { fireEvent, render, screen } from '@testing-library/react';

describe('NavigationAuthDialog', () => {
  it('should wire confirm and cancel', () => {
    const onConfirm = vi.fn();
    const onClose = vi.fn();
    render(<NavigationAuthDialog open onConfirm={onConfirm} onClose={onClose} />);
    expect(screen.getByText('Owner Sign In')).toBeTruthy();
    fireEvent.click(screen.getByText('Confirm'));
    expect(onConfirm).toHaveBeenCalled();
    fireEvent.click(screen.getByText('Cancel'));
    expect(onClose).toHaveBeenCalled();
  });

  it('should render nothing when closed', () => {
    render(<NavigationAuthDialog open={false} onConfirm={vi.fn()} onClose={vi.fn()} />);
    expect(screen.queryByText('Owner Sign In')).toBeNull();
  });
});
