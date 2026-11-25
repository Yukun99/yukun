import { collectItems, hideItems, isShown, itemOf } from '@/pages/3d/utils/items';
import { syncOutlines } from '@/pages/3d/utils/outline';
import { BufferAttribute, BufferGeometry, Group, Mesh, MeshStandardMaterial } from 'three';

const triangle = () => {
  const geometry = new BufferGeometry();
  geometry.setAttribute('position', new BufferAttribute(new Float32Array([0, 0, 0, 1, 0, 0, 0, 1, 0]), 3));
  geometry.setIndex([0, 1, 2]);
  return geometry;
};

const setup = () => {
  const material = new MeshStandardMaterial({ color: '#ff0000' });
  const first = new Mesh(triangle(), material);
  first.userData.item = 0;
  const holder = new Group();
  holder.userData.item = 1;
  const part = new Mesh(triangle(), material);
  holder.add(part);
  const plate = new Group().add(first, holder);
  return { plate, first, part, holder, material };
};

describe('items', () => {
  it('should resolve an item through its ancestors', () => {
    const { first, part, plate } = setup();
    expect(itemOf(first)).toBe(0);
    expect(itemOf(part)).toBe(1);
    expect(itemOf(plate)).toBeNull();
    expect([...collectItems([plate])]).toEqual([0, 1]);
  });

  it('should hide every node of a removed item', () => {
    const { plate, first, part } = setup();
    hideItems([plate], new Set([1]));
    expect(isShown(part)).toBe(false);
    expect(isShown(first)).toBe(true);
  });
});

describe('syncOutlines', () => {
  it('should add and remove an outline without touching the materials', () => {
    const { plate, first, part, material } = setup();
    syncOutlines([plate], new Set([1]));
    expect(part.children).toHaveLength(1);
    expect(first.children).toHaveLength(0);
    expect(part.material).toBe(material);
    syncOutlines([plate], new Set());
    expect(part.children).toHaveLength(0);
  });
});
