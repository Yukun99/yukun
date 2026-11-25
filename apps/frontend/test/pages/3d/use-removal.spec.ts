import useRemoval from '@/pages/3d/use-removal';
import { act, fireEvent, renderHook } from '@testing-library/react';
import { BufferAttribute, BufferGeometry, Group, Mesh, MeshStandardMaterial } from 'three';

const mesh = (item: number) => {
  const geometry = new BufferGeometry();
  geometry.setAttribute('position', new BufferAttribute(new Float32Array(9), 3));
  geometry.setIndex([0, 1, 2]);
  const out = new Mesh(geometry, new MeshStandardMaterial());
  out.userData.item = item;
  return out;
};

const setup = (enabled = true) => {
  const meshes = [mesh(0), mesh(1), mesh(2)];
  const plates = [new Group().add(meshes[0]), new Group().add(meshes[1], meshes[2])];
  const hook = renderHook(() => useRemoval(plates, enabled));
  return { meshes, ...hook };
};

describe('useRemoval', () => {
  it('should toggle an item in and out of the selection', () => {
    const { result } = setup();
    act(() => result.current.toggle(1));
    expect([...result.current.selected]).toEqual([1]);
    act(() => result.current.toggle(1));
    expect(result.current.selected.size).toBe(0);
  });

  it('should remove only the selected items', () => {
    const { result, meshes } = setup();
    act(() => result.current.toggle(1));
    act(() => result.current.remove());
    expect([...result.current.removed]).toEqual([1]);
    expect(meshes.map((item) => item.visible)).toEqual([true, false, true]);
    expect(result.current.selected.size).toBe(0);
  });

  it('should keep a deselected item out of a later removal', () => {
    const { result, meshes } = setup();
    act(() => result.current.toggle(0));
    act(() => result.current.deselect());
    expect(result.current.selected.size).toBe(0);
    act(() => result.current.toggle(1));
    act(() => result.current.toggle(2));
    act(() => result.current.remove());
    expect([...result.current.removed]).toEqual([1, 2]);
    expect(meshes[0].visible).toBe(true);
  });

  it('should drop the outline of a deselected item', () => {
    const { result, meshes } = setup();
    act(() => result.current.toggle(0));
    expect(meshes[0].children).toHaveLength(1);
    act(() => result.current.deselect());
    expect(meshes[0].children).toHaveLength(0);
  });

  it('should remove the selection on the Delete key', () => {
    const { result } = setup();
    act(() => result.current.toggle(2));
    act(() => void fireEvent.keyDown(window, { key: 'Delete' }));
    expect([...result.current.removed]).toEqual([2]);
  });

  it('should ignore the Delete key while typing', () => {
    const { result } = setup();
    const input = document.body.appendChild(document.createElement('input'));
    act(() => result.current.toggle(2));
    act(() => void fireEvent.keyDown(input, { key: 'Delete' }));
    expect(result.current.removed.size).toBe(0);
    input.remove();
  });

  it('should ignore the Delete key when not enabled', () => {
    const { result } = setup(false);
    expect(result.current.active).toBe(false);
    act(() => result.current.toggle(2));
    act(() => void fireEvent.keyDown(window, { key: 'Delete' }));
    expect(result.current.removed.size).toBe(0);
  });

  it('should report empty once every item is removed and clear on reset', () => {
    const { result } = setup();
    [0, 1, 2].forEach((item) => act(() => result.current.toggle(item)));
    act(() => result.current.remove());
    expect(result.current.empty).toBe(true);
    act(() => result.current.reset());
    expect(result.current.removed.size).toBe(0);
    expect(result.current.empty).toBe(false);
  });
});
