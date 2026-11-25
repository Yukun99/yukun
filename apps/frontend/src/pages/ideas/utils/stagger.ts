const STEP = 150;

// delay per row: rows that mount together follow each other, a row that mounts later starts at once
export const createStagger = (step = STEP) => {
  const slots = new Map<number, number>();
  let last = -Infinity;

  return (row: number) => {
    const now = performance.now();
    const at = slots.get(row) ?? Math.max(now, last + step);
    slots.set(row, at);
    last = Math.max(last, at);
    return Math.max(0, at - now);
  };
};
