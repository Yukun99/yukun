import '@/locales/i18n';
import ColourMapping from '@/pages/3d/components/colour-mapping';
import { fireEvent, render, screen } from '@testing-library/react';
import { BufferGeometry, Group, Mesh, MeshStandardMaterial } from 'three';

const setup = (sourceUrl?: string) => {
  const red = new MeshStandardMaterial({ color: '#ff0000' });
  const blue = new MeshStandardMaterial({ color: '#0000ff' });
  const plates = [new Group().add(new Mesh(new BufferGeometry(), [red, blue]))];
  render(<ColourMapping plates={plates} name='model' sourceUrl={sourceUrl} />);
  return { red };
};

describe('ColourMapping', () => {
  it('should list each colour with its original and mapped swatch', () => {
    setup();
    expect(screen.getByRole('img', { name: 'Original colour ff0000' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Change colour 0000ff' })).toBeTruthy();
  });

  it('should hide the download without a source', () => {
    setup();
    expect(screen.queryByRole('button', { name: /Download/ })).toBeNull();
  });

  it('should show the download with a source', () => {
    setup('/api/models/1/source');
    expect(screen.getByRole('button', { name: /Download/ })).toBeTruthy();
  });

  it('should restore the colour when the picker is cancelled', () => {
    const { red } = setup();
    fireEvent.click(screen.getByRole('button', { name: 'Change colour ff0000' }));
    fireEvent.change(screen.getByLabelText('Hex'), { target: { value: '00ff00' } });
    expect(red.color.getHexString()).toBe('00ff00');
    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));
    expect(red.color.getHexString()).toBe('ff0000');
  });
});
