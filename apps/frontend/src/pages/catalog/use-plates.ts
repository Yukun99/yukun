import { disposeObject } from '@/pages/3d/utils/dispose';
import { loadThreeMf } from '@/pages/3d/utils/load-three-mf';
import { useCallback, useEffect, useState } from 'react';
import type { Group } from 'three';

const usePlates = (url: string) => {
  const [plates, setPlates] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [version, setVersion] = useState(0);
  const reload = useCallback(() => setVersion((value) => value + 1), []);
  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;
    let owned: Group[] = [];
    setLoading(true);
    fetch(url, { signal })
      .then((response) => response.arrayBuffer())
      .then((buffer) => loadThreeMf(buffer, signal))
      .then((parsed) => {
        if (signal.aborted) return parsed.forEach(disposeObject);
        owned = parsed;
        setPlates(owned);
        setLoading(false);
      })
      .catch(() => {
        if (!signal.aborted) setLoading(false);
      });
    return () => {
      controller.abort();
      owned.forEach(disposeObject);
      setPlates([]);
    };
  }, [url, version]);
  return { plates, loading, reload };
};

export default usePlates;
