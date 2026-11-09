import '@/locales/i18n';
import ColourPicker from '@/pages/3d/components/colour-picker';
import type { Rgba } from '@/pages/3d/utils/colour';
import { fireEvent, render, screen } from '@testing-library/react';

const value: Rgba = { r: 255, g: 0, b: 0, a: 255 };

const green: Rgba = { r: 0, g: 255, b: 0, a: 128 };

const setup = (others: { hex: string; rgba: Rgba }[] = []) => {
  const anchor = document.createElement('button');
  document.body.appendChild(anchor);
  const onChange = vi.fn();
  const onCancel = vi.fn();
  const onSwap = vi.fn();
  render(
    <ColourPicker
      anchor={anchor}
      value={value}
      others={others}
      onChange={onChange}
      onSwap={onSwap}
      onConfirm={vi.fn()}
      onCancel={onCancel}
    />,
  );
  const field = (label: string) => screen.getByLabelText(label) as HTMLInputElement;
  return { onChange, onCancel, onSwap, field };
};

describe('ColourPicker', () => {
  it('should show the initial colour', () => {
    const { field } = setup();
    expect(field('Hex').value).toBe('ff0000');
    expect(field('R').value).toBe('255');
    expect(field('Opacity').value).toBe('100');
  });

  it('should update the channels and report a typed hex', () => {
    const { field, onChange } = setup();
    fireEvent.change(field('Hex'), { target: { value: '#00ff80' } });
    expect(onChange).toHaveBeenLastCalledWith({ r: 0, g: 255, b: 128, a: 255 });
    expect(field('R').value).toBe('0');
    expect(field('G').value).toBe('255');
    expect(field('B').value).toBe('128');
  });

  it('should update the hex when a channel changes', () => {
    const { field, onChange } = setup();
    fireEvent.change(field('G'), { target: { value: '255' } });
    expect(onChange).toHaveBeenLastCalledWith({ r: 255, g: 255, b: 0, a: 255 });
    expect(field('Hex').value).toBe('ffff00');
  });

  it('should keep the colour when the opacity changes', () => {
    const { field, onChange } = setup();
    fireEvent.change(field('Opacity'), { target: { value: '50' } });
    expect(onChange).toHaveBeenLastCalledWith({ r: 255, g: 0, b: 0, a: 128 });
    expect(field('Hex').value).toBe('ff0000');
  });

  it('should cancel on Escape', () => {
    const { onCancel } = setup();
    fireEvent.keyDown(screen.getByRole('presentation'), { key: 'Escape' });
    expect(onCancel).toHaveBeenCalledOnce();
  });

  it('should not offer other colours when there are none', () => {
    setup();
    expect(screen.queryByRole('button', { name: /^Swap with/ })).toBeNull();
    expect(screen.queryByRole('button', { name: /^Copy / })).toBeNull();
    expect(screen.getByText('Pick colour')).toBeTruthy();
    expect(screen.queryByText('Swap / copy')).toBeNull();
  });

  it('should label both columns when there are other colours', () => {
    setup([{ hex: '00ff00', rgba: green }]);
    expect(screen.getByText('Pick colour')).toBeTruthy();
    expect(screen.getByText('Swap / copy')).toBeTruthy();
  });

  it('should copy another colour', () => {
    const { onChange, onSwap, field } = setup([{ hex: '00ff00', rgba: green }]);
    fireEvent.click(screen.getByRole('button', { name: 'Copy 00ff00' }));
    expect(onChange).toHaveBeenLastCalledWith(green);
    expect(field('Hex').value).toBe('00ff00');
    expect(onSwap).not.toHaveBeenCalled();
  });

  it('should swap with another colour', () => {
    const { onChange, onSwap } = setup([{ hex: '00ff00', rgba: green }]);
    fireEvent.click(screen.getByRole('button', { name: 'Swap with 00ff00' }));
    expect(onChange).toHaveBeenLastCalledWith(green);
    expect(onSwap).toHaveBeenCalledWith('00ff00', value);
  });
});
