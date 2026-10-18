export type Model = { id: number; name: string; link: string; size: number; createdAt: number };

export const MAX_NAME = 50;
export const MAX_LINK = 500;
export const MAX_SIZE = 16 * 1024 * 1024;
export const LINK_PREFIX = 'https://makerworld.com/';
export const API = '/api/models';

export const fileUrl = (id: number) => `${API}/${id}/file`;

export const isValidLink = (link: string) =>
  link === ''
  || (link.startsWith(LINK_PREFIX) && link.length <= MAX_LINK && !/[\s\p{Cc}]/u.test(link));

export const parseModel = (value: unknown): Model | null => {
  if (typeof value !== 'object' || value === null) return null;
  const { id, name, link, size, createdAt } = value as Record<string, unknown>;
  if (
    typeof id !== 'number'
    || typeof name !== 'string'
    || typeof link !== 'string'
    || typeof size !== 'number'
    || typeof createdAt !== 'number'
  ) {
    return null;
  }
  return { id, name, link, size, createdAt };
};

export const parseModels = (body: unknown): Model[] | null => {
  const data = (body as { models?: unknown } | null)?.models;
  if (!Array.isArray(data)) return null;
  const models = data.map(parseModel);
  return models.every((model) => model !== null) ? models : null;
};
