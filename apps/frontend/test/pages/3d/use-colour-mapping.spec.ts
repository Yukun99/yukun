import useColourMapping from '@/pages/3d/use-colour-mapping';
import { act, renderHook } from '@testing-library/react';
import { BufferGeometry, Group, Mesh, MeshStandardMaterial } from 'three';

const setup = () => {
  const red = new MeshStandardMaterial({ color: '#ff0000' });
  const blue = new MeshStandardMaterial({ color: '#0000ff' });
  const one = new Group().add(new Mesh(new BufferGeometry(), [red, blue]));
  const two = new Group().add(new Mesh(new BufferGeometry(), red));
  return { red, blue, plates: [one, two] };
};

describe('useColourMapping', () => {
  it('should list each colour once', () => {
    const { plates } = setup();
    const { result } = renderHook(() => useColourMapping(plates));
    expect(result.current.colours).toEqual(['ff0000', '0000ff']);
  });

  it('should apply a mapping and restore on null', () => {
    const { plates, red } = setup();
    const { result } = renderHook(() => useColourMapping(plates));

    act(() => result.current.set('ff0000', { r: 0, g: 255, b: 0, a: 255 }));
    expect(red.color.getHexString()).toBe('00ff00');
    expect(result.current.mapping.ff0000).toEqual({ r: 0, g: 255, b: 0, a: 255 });

    act(() => result.current.set('ff0000', null));
    expect(red.color.getHexString()).toBe('ff0000');
    expect(result.current.mapping).toEqual({});
  });

  it('should restore originals on unmount', () => {
    const { plates, red } = setup();
    const { result, unmount } = renderHook(() => useColourMapping(plates));
    act(() => result.current.set('ff0000', { r: 0, g: 255, b: 0, a: 128 }));
    unmount();
    expect(red.color.getHexString()).toBe('ff0000');
    expect(red.transparent).toBe(false);
  });

  it('should replace the whole mapping', () => {
    const { plates, red, blue } = setup();
    const { result } = renderHook(() => useColourMapping(plates));
    act(() => result.current.set('ff0000', { r: 0, g: 255, b: 0, a: 255 }));
    act(() => result.current.replace({ '0000ff': { r: 255, g: 255, b: 0, a: 255 } }));
    expect(Object.keys(result.current.mapping)).toEqual(['0000ff']);
    expect(red.color.getHexString()).toBe('ff0000');
    expect(blue.color.getHexString()).toBe('ffff00');
  });
});
