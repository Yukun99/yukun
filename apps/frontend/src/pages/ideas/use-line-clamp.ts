import { RefObject, useEffect, useState } from 'react';

const measure = (box: HTMLElement) => {
  const style = getComputedStyle(box.firstElementChild ?? box);
  const lineHeight = parseFloat(style.lineHeight) || parseFloat(style.fontSize) * 1.5;
  return lineHeight > 0 ? Math.max(1, Math.floor(box.clientHeight / lineHeight)) : 1;
};

const useLineClamp = (ref: RefObject<HTMLElement | null>) => {
  const [lines, setLines] = useState(1);

  useEffect(() => {
    const box = ref.current;
    if (!box) return;
    setLines(measure(box));
    const observer = new ResizeObserver(() => setLines(measure(box)));
    observer.observe(box);
    return () => observer.disconnect();
  }, [ref]);

  return lines;
};

export default useLineClamp;
