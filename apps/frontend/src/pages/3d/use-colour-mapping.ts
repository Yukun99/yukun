import type { Rgba } from '@/pages/3d/utils/colour';
import { applyColour, collectColours } from '@/pages/3d/utils/colours';
import { useCallback, useEffect, useMemo, useState } from 'react';
import type { Object3D } from 'three';

const useColourMapping = (plates: Object3D[]) => {
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

  return { colours: useMemo(() => [...groups.keys()], [groups]), mapping, set };
};

export default useColourMapping;
