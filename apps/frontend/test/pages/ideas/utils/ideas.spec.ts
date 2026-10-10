import {
  addRow,
  clamp,
  clear,
  COLS,
  EMPTY,
  emptyGrid,
  type Idea,
  isEmpty,
  MAX_CONTENT,
  MAX_TITLE,
  parse,
  ROWS,
  swap,
  update,
} from '@/pages/ideas/utils/ideas';

const a: Idea = { title: 'a', content: 'one' };
const b: Idea = { title: 'b', content: 'two' };

describe('ideas utils', () => {
  it('should build an empty grid of the given rows', () => {
    expect(emptyGrid()).toHaveLength(ROWS * COLS);
    expect(emptyGrid(2)).toHaveLength(2 * COLS);
  });

  it('should treat blank and whitespace ideas as empty', () => {
    expect(isEmpty(EMPTY)).toBe(true);
    expect(isEmpty({ title: '  ', content: '\n' })).toBe(true);
    expect(isEmpty({ title: 'x', content: '' })).toBe(false);
    expect(isEmpty({ title: '', content: 'x' })).toBe(false);
  });

  it('should swap two slots without mutating', () => {
    const ideas = [a, b, EMPTY];
    expect(swap(ideas, 0, 1)).toEqual([b, a, EMPTY]);
    expect(ideas).toEqual([a, b, EMPTY]);
  });

  it('should move an idea into an empty slot', () => {
    expect(swap([a, EMPTY], 0, 1)).toEqual([EMPTY, a]);
  });

  it('should return the same array for same or out of range indexes', () => {
    const ideas = [a, b];
    expect(swap(ideas, 1, 1)).toBe(ideas);
    expect(swap(ideas, 0, 5)).toBe(ideas);
    expect(swap(ideas, -1, 0)).toBe(ideas);
  });

  it('should clear and update a slot', () => {
    expect(clear([a, b], 0)).toEqual([EMPTY, b]);
    expect(update([a, b], 1, a)).toEqual([a, a]);
  });

  it('should add one row of empties', () => {
    const grid = emptyGrid();
    const next = addRow(grid);
    expect(next).toHaveLength(grid.length + COLS);
    expect(next.slice(grid.length).every(isEmpty)).toBe(true);
  });

  describe('parse', () => {
    const body = (ideas: unknown) => ({ ideas });

    it('should accept a valid body', () => {
      const grid = emptyGrid();
      grid[3] = a;
      expect(parse(body(grid))).toEqual(grid);
    });

    it('should reject malformed bodies', () => {
      expect(parse(null)).toBeNull();
      expect(parse('{nope')).toBeNull();
      expect(parse({})).toBeNull();
      expect(parse(body({ title: 'a' }))).toBeNull();
      expect(parse(body([a, { title: 'x' }]))).toBeNull();
      expect(parse(body([a, { title: 'x', content: 3 }]))).toBeNull();
      expect(parse(body([null]))).toBeNull();
    });

    it('should pad short lists to the minimum grid', () => {
      expect(parse(body([a]))).toHaveLength(ROWS * COLS);
    });

    it('should pad to a whole row', () => {
      const items = Array.from({ length: 25 }, () => a);
      expect(parse(body(items))).toHaveLength(30);
    });
  });

  describe('clamp', () => {
    it('should slice both fields to their limits', () => {
      const out = clamp({ title: 'a'.repeat(MAX_TITLE + 5), content: 'b'.repeat(MAX_CONTENT + 5) });
      expect(out.title).toHaveLength(MAX_TITLE);
      expect(out.content).toHaveLength(MAX_CONTENT);
      expect(clamp(a)).toEqual(a);
    });
  });
});
