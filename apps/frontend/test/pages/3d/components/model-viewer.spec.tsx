import '@/locales/i18n';
import ModelViewer from '@/pages/3d/components/model-viewer';
import { fireEvent, render, screen } from '@testing-library/react';
import { Group } from 'three';

const removal = vi.hoisted(() => ({
  active: true,
  removed: new Set<number>(),
  selected: new Set<number>(),
  toggle: vi.fn(),
  remove: vi.fn(),
  deselect: vi.fn(),
  reset: vi.fn(),
  empty: false,
}));

vi.mock('@react-three/fiber', () => ({ Canvas: () => null, useThree: vi.fn() }));
vi.mock('@react-three/drei', () => ({ Center: () => null, OrbitControls: () => null }));
vi.mock('@/pages/3d/use-removal', () => ({ default: () => removal }));

describe('ModelViewer', () => {
  beforeEach(() => vi.clearAllMocks());

  it('should clear the selection when the plate changes', () => {
    render(<ModelViewer objects={[new Group(), new Group()]} editable />);
    fireEvent.click(screen.getByRole('button', { name: 'Next plate' }));
    expect(removal.deselect).toHaveBeenCalledTimes(1);
    expect(removal.remove).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole('button', { name: 'Previous plate' }));
    expect(removal.deselect).toHaveBeenCalledTimes(2);
  });

  it('should reset deletions and ask the owner of the objects to reload', () => {
    const onReload = vi.fn();
    render(
      <ModelViewer
        objects={[new Group()]}
        editable
        onReload={onReload}
        recolour={{ name: 'model' }}
      />,
    );
    fireEvent.click(screen.getByRole('button', { name: 'Reload model' }));
    expect(removal.reset).toHaveBeenCalledTimes(1);
    expect(onReload).toHaveBeenCalledTimes(1);
  });
});
