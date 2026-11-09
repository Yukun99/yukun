import {
  API,
  fileUrl,
  type Model,
  parseModel,
  parseModels,
  sourceUrl,
  thumbnailUrl,
} from '@/pages/3d/utils/models';
import { useCallback, useEffect, useRef, useState } from 'react';

const put = (url: string, body: ArrayBuffer, bearer: string) =>
  fetch(url, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/octet-stream', Authorization: `Bearer ${bearer}` },
    body,
  }).catch(() => null);

const attach = async (
  model: Model,
  thumbnail: ArrayBuffer | null,
  source: ArrayBuffer | null,
  bearer: string,
) => {
  let result = model;
  let refused = false;
  if (thumbnail) {
    const res = await put(thumbnailUrl(model.id), thumbnail, bearer);
    if (res?.status === 401 || res?.status === 403) refused = true;
    else if (res?.status === 204) result = { ...result, thumbnail: true };
  }
  if (source) {
    const res = await put(sourceUrl(model.id), source, bearer);
    if (res?.status === 401 || res?.status === 403) refused = true;
    else if (res?.status === 204) result = { ...result, source: true };
  }
  return { model: result, refused };
};

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
    async (
      data: ArrayBuffer,
      name: string,
      link: string,
      thumbnail: ArrayBuffer | null,
      source: ArrayBuffer | null,
    ) => {
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
        const created = res.status === 201 ? parseModel(await res.json()) : null;
        if (!created) return false;
        const { model, refused } = await attach(created, thumbnail, source, bearer);
        if (mounted.current) {
          setModels((current) => [...current, model]);
          setSelected(model.id);
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

  const update = useCallback(async (id: number, name: string, link: string) => {
    const { token: bearer, onUnauthorized: unauthorized } = auth.current;
    if (busy.current || !bearer) return false;
    busy.current = true;
    try {
      const res = await fetch(`${API}/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${bearer}` },
        body: JSON.stringify({ name, link }),
      });
      if (res.status === 401 || res.status === 403) {
        unauthorized();
        return false;
      }
      const model = res.status === 200 ? parseModel(await res.json()) : null;
      if (!model) return false;
      if (mounted.current) {
        setModels((current) => current.map((item) => (item.id === id ? model : item)));
      }
      return true;
    } catch {
      return false;
    } finally {
      busy.current = false;
    }
  }, []);

  const replace = useCallback(
    async (
      id: number,
      data: ArrayBuffer,
      thumbnail: ArrayBuffer | null,
      source: ArrayBuffer | null,
    ) => {
      const { token: bearer, onUnauthorized: unauthorized } = auth.current;
      if (busy.current || !bearer) return false;
      busy.current = true;
      try {
        const res = await put(fileUrl(id), data, bearer);
        if (res?.status === 401 || res?.status === 403) {
          unauthorized();
          return false;
        }
        const replaced = res?.status === 200 ? parseModel(await res.json()) : null;
        if (!replaced) return false;
        const { model, refused } = await attach(replaced, thumbnail, source, bearer);
        if (mounted.current) {
          setModels((current) => current.map((item) => (item.id === id ? model : item)));
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

  return { models, ready, selected, select: setSelected, upload, update, replace, remove };
};

export default useModels;
