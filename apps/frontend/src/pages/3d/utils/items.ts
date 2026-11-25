import type { Object3D } from 'three';

const stamped = (object: Object3D) => typeof object.userData.item === 'number';

export const itemOf = (object: Object3D | null) => {
  for (let node = object; node; node = node.parent) {
    if (stamped(node)) return node.userData.item as number;
  }
  return null;
};

export const collectItems = (plates: Object3D[]) => {
  const items = new Set<number>();
  for (const plate of plates) {
    plate.traverse((node) => stamped(node) && items.add(node.userData.item));
  }
  return items;
};

export const hideItems = (plates: Object3D[], items: ReadonlySet<number>) => {
  for (const plate of plates) {
    plate.traverse((node) => {
      if (stamped(node) && items.has(node.userData.item)) node.visible = false;
    });
  }
};

export const isShown = (object: Object3D) => {
  for (let node: Object3D | null = object; node; node = node.parent) if (!node.visible) return false;
  return true;
};
