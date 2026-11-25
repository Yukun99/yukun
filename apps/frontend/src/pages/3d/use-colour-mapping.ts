import type { Rgba } from '@/pages/3d/utils/colour';
import { applyColour, collectColours } from '@/pages/3d/utils/colours';
import { itemOf } from '@/pages/3d/utils/items';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { type Material, Mesh, type Object3D } from 'three';

const NONE: ReadonlySet<number> = new Set();

const useColourMapping = (plates: Object3D[], removed = NONE) => {
  const groups = useMemo(() => collectColours(plates), [plates]);
  const [state, setState] = useState<{ plates: Object3D[]; mapping: Record<string, Rgba> }>({
    plates,
    mapping: {},
  });
  const mapping = useMemo(
    () => (state.plates === plates ? state.mapping : {}),
    [state, plates],
  );

  useEffect(() => {
    for (const [hex, entries] of groups) applyColour(entries, mapping[hex] ?? null);
  }, [groups, mapping]);

  useEffect(
    () => () => {
      for (const entries of groups.values()) applyColour(entries, null);
    },
    [groups],
  );

  const set = useCallback(
    (hex: string, rgba: Rgba | null) =>
      setState((current) => {
        const next = { ...(current.plates === plates ? current.mapping : {}) };
        if (rgba) next[hex] = rgba;
        else delete next[hex];
        return { plates, mapping: next };
      }),
    [plates],
  );

  const replace = useCallback(
    (next: Record<string, Rgba>) => setState({ plates, mapping: next }),
    [plates],
  );

  const colours = useMemo(() => {
    const used = new Set<Material>();
    for (const plate of plates) {
      plate.traverse((node) => {
        const item = itemOf(node);
        if (!(node instanceof Mesh) || (item !== null && removed.has(item))) return;
        [node.material].flat().forEach((material) => used.add(material));
      });
    }
    return [...groups]
      .filter(([, entries]) => entries.some(({ material }) => used.has(material)))
      .map(([hex]) => hex);
  }, [groups, plates, removed]);

  return { colours, mapping, set, replace };
};

export default useColourMapping;
