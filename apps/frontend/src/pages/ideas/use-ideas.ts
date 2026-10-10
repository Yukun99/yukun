import {
  addRow,
  clamp,
  clear,
  emptyGrid,
  type Idea,
  parse,
  swap,
  update,
} from '@/pages/ideas/utils/ideas';
import { type RefObject, useCallback, useEffect, useRef, useState } from 'react';

const URL = '/api/ideas';
const DELAY = 400;

const take = (ref: RefObject<Idea[] | null>) => {
  const grid = ref.current;
  ref.current = null;
  return grid;
};

const useIdeas = (token: string | null, onUnauthorized: () => void) => {
  const [ideas, setIdeas] = useState<Idea[]>(emptyGrid);
  const [loading, setLoading] = useState(true);
  const [ready, setReady] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pending = useRef<Idea[] | null>(null);
  const saving = useRef(false);
  const mounted = useRef(true);
  const auth = useRef({ token, onUnauthorized });

  useEffect(() => {
    auth.current = { token, onUnauthorized };
  }, [token, onUnauthorized]);

  const load = useCallback(async () => {
    const grid = await fetch(URL)
      .then((res) => (res.ok ? res.json() : null))
      .then(parse)
      .catch(() => null);
    if (!mounted.current) return;
    setIdeas(grid ?? emptyGrid());
    setReady(grid !== null);
    setLoading(false);
  }, []);

  const save = useCallback(async () => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = null;
    const { token: bearer, onUnauthorized: unauthorized } = auth.current;
    // one PUT at a time, so an older grid can never land after a newer one
    if (saving.current || !bearer) return;
    saving.current = true;
    for (let grid = take(pending); grid; grid = take(pending)) {
      const res = await fetch(URL, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${bearer}` },
        body: JSON.stringify({ ideas: grid.map(clamp) }),
      }).catch(() => null);
      if (res?.status === 401 || res?.status === 403) {
        pending.current = null;
        unauthorized();
        if (mounted.current) await load();
        break;
      }
    }
    saving.current = false;
  }, [load]);

  useEffect(() => {
    mounted.current = true;
    load();
    return () => {
      mounted.current = false;
      if (timer.current) {
        clearTimeout(timer.current);
        save();
      }
    };
  }, [load, save]);

  const mutate = useCallback(
    (change: (current: Idea[]) => Idea[]) => {
      if (!ready || !auth.current.token) return;
      setIdeas((current) => {
        const next = change(current);
        if (next !== current) {
          pending.current = next;
          if (timer.current) clearTimeout(timer.current);
          timer.current = setTimeout(save, DELAY);
        }
        return next;
      });
    },
    [ready, save],
  );

  const setIdea = useCallback(
    (index: number, idea: Idea) => mutate((current) => update(current, index, idea)),
    [mutate],
  );
  const clearIdea = useCallback(
    (index: number) => mutate((current) => clear(current, index)),
    [mutate],
  );
  const swapIdeas = useCallback(
    (from: number, to: number) => mutate((current) => swap(current, from, to)),
    [mutate],
  );
  const addIdeaRow = useCallback(() => mutate(addRow), [mutate]);

  return { ideas, loading, ready, setIdea, clearIdea, swapIdeas, addRow: addIdeaRow };
};

export default useIdeas;
