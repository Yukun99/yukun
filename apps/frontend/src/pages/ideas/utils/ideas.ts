export type Idea = { title: string; content: string };

export const COLS = 6;
export const ROWS = 4;
export const EMPTY: Idea = { title: '', content: '' };

export const emptyGrid = (rows = ROWS): Idea[] => Array.from({ length: rows * COLS }, () => EMPTY);

export const isEmpty = (idea: Idea) => !idea.title.trim() && !idea.content.trim();

export const swap = (ideas: Idea[], from: number, to: number): Idea[] => {
  const inRange = (i: number) => Number.isInteger(i) && i >= 0 && i < ideas.length;
  if (from === to || !inRange(from) || !inRange(to)) return ideas;
  const next = [...ideas];
  [next[from], next[to]] = [next[to], next[from]];
  return next;
};

export const update = (ideas: Idea[], index: number, idea: Idea): Idea[] =>
  ideas.map((current, i) => (i === index ? idea : current));

export const clear = (ideas: Idea[], index: number): Idea[] => update(ideas, index, EMPTY);

export const addRow = (ideas: Idea[]): Idea[] => [...ideas, ...emptyGrid(1)];

const isIdea = (value: unknown): value is Idea =>
  typeof value === 'object'
  && value !== null
  && typeof (value as Idea).title === 'string'
  && typeof (value as Idea).content === 'string';

export const MAX_TITLE = 50;
export const MAX_CONTENT = 5000;

export const clamp = ({ title, content }: Idea): Idea => ({
  title: title.slice(0, MAX_TITLE),
  content: content.slice(0, MAX_CONTENT),
});

export const parse = (body: unknown): Idea[] | null => {
  const data = (body as { ideas?: unknown } | null)?.ideas;
  if (!Array.isArray(data) || !data.every(isIdea)) return null;
  const ideas = data.map(({ title, content }) => ({ title, content }));
  const size = Math.max(Math.ceil(ideas.length / COLS) * COLS, ROWS * COLS);
  return [...ideas, ...Array.from({ length: size - ideas.length }, () => EMPTY)];
};
