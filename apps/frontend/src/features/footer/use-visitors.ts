import { useEffect, useState } from 'react';

export type Visitors = { number: number | null; total: number };

const parse = (data: unknown): Visitors | null => {
  const { number, total } = (data ?? {}) as Partial<Visitors>;
  if (typeof total !== 'number') return null;
  return { number: typeof number === 'number' ? number : null, total };
};

const useVisitors = () => {
  const [visitors, setVisitors] = useState<Visitors | null>(null);

  useEffect(() => {
    // Dev proxies /api to the live site unless VITE_API_URL names a local one, so only read there.
    const method = import.meta.env.DEV && !import.meta.env.VITE_API_URL ? 'GET' : 'POST';
    let active = true;
    fetch('/api/visitors', { method })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => active && setVisitors(parse(data)))
      .catch(() => active && setVisitors(null));
    return () => {
      active = false;
    };
  }, []);

  return visitors;
};

export default useVisitors;
