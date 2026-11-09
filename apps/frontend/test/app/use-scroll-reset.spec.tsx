import useScrollReset from '@/app/use-scroll-reset';
import { ScrollViewportContext } from '@/common/contexts/scroll-context';
import { act, render } from '@testing-library/react';
import { type ReactNode } from 'react';
import { MemoryRouter, useNavigate } from 'react-router-dom';

let go: (to: string) => void = () => undefined;

const Probe = () => {
  useScrollReset();
  go = useNavigate();
  return null;
};

const setup = () => {
  const viewport = { scrollTop: 50 };
  const wrap = (children: ReactNode) => (
    <MemoryRouter initialEntries={['/a']}>
      <ScrollViewportContext.Provider value={viewport as HTMLElement}>
        {children}
      </ScrollViewportContext.Provider>
    </MemoryRouter>
  );
  render(wrap(<Probe />));
  return viewport;
};

describe('useScrollReset', () => {
  it('should leave the scroll position alone on first render', () => {
    expect(setup().scrollTop).toBe(50);
  });

  it('should scroll to the top when the path changes', () => {
    const viewport = setup();
    act(() => go('/b'));
    expect(viewport.scrollTop).toBe(0);
  });

  it('should not scroll when the path stays the same', () => {
    const viewport = setup();
    act(() => go('/a'));
    expect(viewport.scrollTop).toBe(50);
  });
});
