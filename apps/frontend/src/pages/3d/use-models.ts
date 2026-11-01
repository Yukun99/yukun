import { API, type Model, parseModel, parseModels } from '@/pages/3d/utils/models';
import { useCallback, useEffect, useRef, useState } from 'react';

const useModels = (token: string | null, onUnauthorized: () => void) => {
  const [models, setModels] = useState<Model[]>([]);
  const [ready, setReady] = useState(false);
  const [selected, setSelected] = useState<number | null>(null);
  const busy = useRef(false);
  const mounted = useRef(true);
  const auth = useRef({ token, onUnauthorized });
  const list = useRef<Model[]>([]);

  useEffect(() => {
    auth.current = { token, onUnauthorized };
  }, [token, onUnauthorized]);

  useEffect(() => {
    list.current = models;
  }, [models]);

  useEffect(() => {
    mounted.current = true;
    fetch(API)
      .then((res) => (res.ok ? res.json() : null))
      .then(parseModels)
      .catch(() => null)
      .then((list) => {
        if (!mounted.current || !list) return;
        setModels(list);
        setSelected((current) => current ?? list[0]?.id ?? null);
        setReady(true);
      });
    return () => {
      mounted.current = false;
    };
  }, []);

  const upload = useCallback(
    async (data: ArrayBuffer, name: string, link: string, thumbnail: ArrayBuffer | null) => {
      const { token: bearer, onUnauthorized: unauthorized } = auth.current;
      if (busy.current || !bearer) return false;
      busy.current = true;
      try {
        const res = await fetch(`${API}?${new URLSearchParams({ name, link })}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/octet-stream', Authorization: `Bearer ${bearer}` },
          body: data,
        });
        if (res.status === 401 || res.status === 403) {
          unauthorized();
          return false;
        }
        let model = res.status === 201 ? parseModel(await res.json()) : null;
        if (!model) return false;
        let refused = false;
        if (thumbnail) {
          const put = await fetch(`${API}/${model.id}/thumbnail`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/octet-stream',
              Authorization: `Bearer ${bearer}`,
            },
            body: thumbnail,
          }).catch(() => null);
          if (put?.status === 401 || put?.status === 403) refused = true;
          else if (put?.status === 204) model = { ...model, thumbnail: true };
        }
        if (mounted.current) {
          const added = model;
          setModels((current) => [...current, added]);
          setSelected(added.id);
        }
        if (refused) unauthorized();
        return true;
      } catch {
        return false;
      } finally {
        busy.current = false;
      }
    },
    [],
  );

  const remove = useCallback(async (id: number) => {
    const { token: bearer, onUnauthorized: unauthorized } = auth.current;
    if (busy.current || !bearer) return false;
    busy.current = true;
    try {
      const res = await fetch(`${API}/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${bearer}` },
      });
      if (res.status === 401 || res.status === 403) {
        unauthorized();
        return false;
      }
      if (res.status !== 204 && res.status !== 404) return false;
      if (mounted.current) {
        const rest = list.current.filter((model) => model.id !== id);
        setModels(rest);
        setSelected((value) => (value === id ? (rest[0]?.id ?? null) : value));
      }
      return true;
    } catch {
      return false;
    } finally {
      busy.current = false;
    }
  }, []);

  return { models, ready, selected, select: setSelected, upload, remove };
};

export default useModels;
