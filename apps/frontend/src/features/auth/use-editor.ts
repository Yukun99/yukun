import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

export const TOKEN_KEY = 'ideas-token';

const USERINFO_URL = 'https://www.googleapis.com/oauth2/v3/userinfo';
const MAX_DELAY = 2 ** 31 - 1;

type Session = { token: string; email: string; exp: number };

const parse = (raw: string | null): Session | null => {
  try {
    const value = raw ? JSON.parse(raw) : null;
    if (
      typeof value?.token === 'string'
      && typeof value?.email === 'string'
      && typeof value?.exp === 'number'
      && value.exp > Date.now()
    ) {
      return { token: value.token, email: value.email.toLowerCase(), exp: value.exp };
    }
  } catch {
    return null;
  }
  return null;
};

const read = () => {
  try {
    const raw = sessionStorage.getItem(TOKEN_KEY);
    const session = parse(raw);
    if (raw && !session) sessionStorage.removeItem(TOKEN_KEY);
    return session;
  } catch {
    return null;
  }
};

const write = (session: Session | null) => {
  try {
    if (session) sessionStorage.setItem(TOKEN_KEY, JSON.stringify(session));
    else sessionStorage.removeItem(TOKEN_KEY);
  } catch {
    return;
  }
};

const fetchEmail = async (accessToken: string) => {
  const res = await fetch(USERINFO_URL, { headers: { Authorization: `Bearer ${accessToken}` } });
  if (!res.ok) return null;
  const info = await res.json();
  return typeof info?.email === 'string' && info.email_verified === true
    ? info.email.toLowerCase()
    : null;
};

const useEditor = () => {
  const { t } = useTranslation();
  const owner = t('common.email').toLowerCase();
  const [session, setSession] = useState<Session | null>(read);
  const [rejected, setRejected] = useState(false);
  const attempt = useRef(0);

  const signOut = useCallback(() => {
    attempt.current += 1;
    write(null);
    setSession(null);
    setRejected(false);
  }, []);

  const signIn = useCallback(
    async (accessToken: string, expiresIn: number) => {
      const id = ++attempt.current;
      setRejected(false);
      const email = await fetchEmail(accessToken).catch(() => null);
      // a newer sign-in or a sign-out made this response stale
      if (id !== attempt.current) return;
      if (email !== owner) {
        setRejected(true);
        return;
      }
      const next = { token: accessToken, email, exp: Date.now() + expiresIn * 1000 };
      write(next);
      setSession(next);
    },
    [owner],
  );

  useEffect(() => {
    if (!session) return;
    const timer = setTimeout(signOut, Math.min(session.exp - Date.now(), MAX_DELAY));
    return () => clearTimeout(timer);
  }, [session, signOut]);

  const email = session?.email ?? null;

  return { token: session?.token ?? null, email, editor: email === owner, rejected, signIn, signOut };
};

export default useEditor;
