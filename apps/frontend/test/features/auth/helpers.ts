import { TOKEN_KEY } from '@/features/auth/use-editor';

export const OWNER = 'yukunxu123@gmail.com';

export const seedSession = (email: string, exp = Date.now() + 3600_000) =>
  sessionStorage.setItem(TOKEN_KEY, JSON.stringify({ token: 'access', email, exp }));
