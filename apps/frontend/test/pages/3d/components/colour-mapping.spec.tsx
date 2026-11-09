import '@/locales/i18n';
import ColourMapping from '@/pages/3d/components/colour-mapping';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { BufferGeometry, Group, Mesh, MeshStandardMaterial } from 'three';

const setup = (sourceUrl?: string, noSwap?: boolean) => {
  const red = new MeshStandardMaterial({ color: '#ff0000' });
  const blue = new MeshStandardMaterial({ color: '#0000ff' });
  const plates = [new Group().add(new Mesh(new BufferGeometry(), [red, blue]))];
  render(
    <ColourMapping
      plates={plates}
      id={1}
      updatedAt={5}
      name='model'
      sourceUrl={sourceUrl}
      noSwap={noSwap}
    />,
  );
  return { red, blue };
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

  it('should swap two colours and restore both when cancelled', () => {
    const { red, blue } = setup();
    fireEvent.click(screen.getByRole('button', { name: 'Change colour ff0000' }));
    fireEvent.click(screen.getByRole('button', { name: 'Swap with 0000ff' }));
    expect(red.color.getHexString()).toBe('0000ff');
    expect(blue.color.getHexString()).toBe('ff0000');
    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));
    expect(red.color.getHexString()).toBe('ff0000');
    expect(blue.color.getHexString()).toBe('0000ff');
  });

  it('should hide the swap panel when swapping is off', () => {
    setup(undefined, true);
    fireEvent.click(screen.getByRole('button', { name: 'Change colour ff0000' }));
    expect(screen.queryByRole('button', { name: 'Swap with 0000ff' })).toBeNull();
  });

  it('should reload instead of downloading when the model changed', async () => {
    const model = {
      id: 1,
      name: 'm',
      link: '',
      size: 1,
      createdAt: 1,
      updatedAt: 9,
      thumbnail: false,
      source: true,
    };
    const fetchMock = vi
      .fn()
      .mockResolvedValue({ ok: true, json: () => Promise.resolve({ models: [model] }) });
    const reload = vi.fn();
    vi.stubGlobal('fetch', fetchMock);
    vi.stubGlobal('location', { ...window.location, reload });
    setup('/api/models/1/source');

    fireEvent.click(screen.getByRole('button', { name: /Download/ }));

    await waitFor(() => expect(reload).toHaveBeenCalledOnce());
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock.mock.calls[0][0]).toBe('/api/models');
    vi.unstubAllGlobals();
  });

  it('should go on to the download when the model list cannot be fetched', async () => {
    const fetchMock = vi
      .fn()
      .mockRejectedValueOnce(new Error('offline'))
      .mockResolvedValue({ ok: false });
    const reload = vi.fn();
    vi.stubGlobal('fetch', fetchMock);
    vi.stubGlobal('location', { ...window.location, reload });
    setup('/api/models/1/source');

    fireEvent.click(screen.getByRole('button', { name: /Download/ }));

    expect(await screen.findByText('Download failed')).toBeTruthy();
    expect(fetchMock.mock.calls.map(([url]) => url)).toEqual(['/api/models', '/api/models/1/source']);
    expect(reload).not.toHaveBeenCalled();
    vi.unstubAllGlobals();
  });
});
