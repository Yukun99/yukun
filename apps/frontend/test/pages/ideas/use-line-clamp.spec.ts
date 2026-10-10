import useLineClamp from '@/pages/ideas/use-line-clamp';
import { renderHook } from '@testing-library/react';

const box = (height: number, lineHeight: string, fontSize = '16px') => {
  const element = document.createElement('div');
  element.style.lineHeight = lineHeight;
  element.style.fontSize = fontSize;
  Object.defineProperty(element, 'clientHeight', { value: height });
  return { current: element };
};

describe('useLineClamp', () => {
  it('should fit whole lines into the box', () => {
    const { result } = renderHook(() => useLineClamp(box(100, '24px')));
    expect(result.current).toBe(4);
  });

  it('should fall back to 1.5 times the font size for a normal line height', () => {
    const { result } = renderHook(() => useLineClamp(box(100, 'normal', '20px')));
    expect(result.current).toBe(3);
  });

  it('should show at least one line', () => {
    const { result } = renderHook(() => useLineClamp(box(5, '24px')));
    expect(result.current).toBe(1);
  });

  it('should read the line height of the text inside the box', () => {
    const ref = box(100, '24px');
    const text = document.createElement('p');
    text.style.lineHeight = '50px';
    ref.current.appendChild(text);
    const { result } = renderHook(() => useLineClamp(ref));
    expect(result.current).toBe(2);
  });
});
