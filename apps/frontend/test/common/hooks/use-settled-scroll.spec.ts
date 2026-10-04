import useSettledScroll from '@/common/hooks/use-settled-scroll';
import { renderHook } from '@testing-library/react';

const DELAY = 50;

const mockMotion = (reduced: boolean) => {
  window.matchMedia = vi.fn().mockReturnValue({ matches: reduced }) as typeof window.matchMedia;
};

const scroll = (container: HTMLElement) => container.dispatchEvent(new Event('scroll'));

describe('useSettledScroll', () => {
  let container: HTMLDivElement;
  const onSettle = vi.fn();

  beforeEach(() => {
    vi.useFakeTimers();
    mockMotion(false);
    onSettle.mockClear();
    container = document.createElement('div');
  });

  afterEach(() => vi.useRealTimers());

  it('settles once after scrolling stops', () => {
    renderHook(() => useSettledScroll(container, onSettle, DELAY));

    scroll(container);
    vi.advanceTimersByTime(DELAY - 10);
    scroll(container);
    vi.advanceTimersByTime(DELAY - 10);
    expect(onSettle).not.toHaveBeenCalled();

    vi.advanceTimersByTime(10);
    expect(onSettle).toHaveBeenCalledTimes(1);
    expect(onSettle).toHaveBeenCalledWith(container, 'smooth');
  });

  it('waits for the finger to lift', () => {
    renderHook(() => useSettledScroll(container, onSettle, DELAY));

    window.dispatchEvent(new Event('touchstart'));
    scroll(container);
    vi.advanceTimersByTime(DELAY);
    expect(onSettle).not.toHaveBeenCalled();

    window.dispatchEvent(new Event('touchend'));
    vi.advanceTimersByTime(DELAY);
    expect(onSettle).toHaveBeenCalledTimes(1);
  });

  it('scrolls instantly when motion is reduced', () => {
    mockMotion(true);
    renderHook(() => useSettledScroll(container, onSettle, DELAY));

    scroll(container);
    vi.advanceTimersByTime(DELAY);
    expect(onSettle).toHaveBeenCalledWith(container, 'auto');
  });

  it('does nothing without a container', () => {
    renderHook(() => useSettledScroll(null, onSettle, DELAY));

    window.dispatchEvent(new Event('touchend'));
    vi.advanceTimersByTime(DELAY);
    expect(onSettle).not.toHaveBeenCalled();
  });

  it('stops listening on unmount', () => {
    const { unmount } = renderHook(() => useSettledScroll(container, onSettle, DELAY));

    scroll(container);
    unmount();
    scroll(container);
    window.dispatchEvent(new Event('touchend'));
    vi.advanceTimersByTime(DELAY);
    expect(onSettle).not.toHaveBeenCalled();
  });
});
