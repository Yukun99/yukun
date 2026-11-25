import { collectItems, hideItems } from '@/pages/3d/utils/items';
import { syncOutlines } from '@/pages/3d/utils/outline';
import { useCallback, useEffect, useMemo, useState } from 'react';
import type { Object3D } from 'three';

const NONE: ReadonlySet<number> = new Set();
const OPEN_MODAL = '.MuiModal-root:not(.MuiModal-hidden)';

const typing = (target: EventTarget | null) =>
  target instanceof HTMLElement
  && (target.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName));

const useRemoval = (plates: Object3D[], enabled: boolean) => {
  const items = useMemo(() => collectItems(plates), [plates]);
  const active = enabled && items.size > 0;
  const [removed, setRemoved] = useState(NONE);
  const [selected, setSelected] = useState(NONE);

  const toggle = useCallback(
    (item: number) =>
      setSelected((current) => {
        const next = new Set(current);
        if (!next.delete(item)) next.add(item);
        return next;
      }),
    [],
  );

  const remove = useCallback(() => {
    if (!selected.size) return;
    hideItems(plates, selected);
    setRemoved(new Set([...removed, ...selected]));
    setSelected(NONE);
  }, [plates, removed, selected]);

  const deselect = useCallback(() => setSelected(NONE), []);

  const reset = useCallback(() => {
    setRemoved(NONE);
    setSelected(NONE);
  }, []);

  useEffect(() => syncOutlines(plates, selected), [plates, selected]);

  useEffect(() => {
    if (!active) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== 'Delete' || typing(event.target) || document.querySelector(OPEN_MODAL)) {
        return;
      }
      remove();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [active, remove]);

  return {
    active,
    removed,
    selected,
    toggle,
    remove,
    deselect,
    reset,
    empty: items.size > 0 && removed.size >= items.size,
  };
};

export default useRemoval;
