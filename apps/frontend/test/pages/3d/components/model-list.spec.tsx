import '@/locales/i18n';
import ModelList from '@/pages/3d/components/model-list';
import { fireEvent, render, screen } from '@testing-library/react';

const model = {
  id: 1,
  name: 'Benchy',
  link: '',
  size: 4,
  createdAt: 1,
  updatedAt: 1,
  thumbnail: false,
  source: false,
};

const setup = (editable: boolean) => {
  const props = { onSelect: vi.fn(), onUpload: vi.fn(), onEdit: vi.fn(), onDelete: vi.fn() };
  render(<ModelList models={[model]} selected={1} editable={editable} {...props} />);
  return props;
};

describe('ModelList', () => {
  it('should call onEdit with the model when the edit button is clicked', () => {
    const props = setup(true);
    fireEvent.click(screen.getByRole('button', { name: 'Edit' }));
    expect(props.onEdit).toHaveBeenCalledWith(model);
    expect(props.onSelect).not.toHaveBeenCalled();
  });

  it('should hide the edit button when not editable', () => {
    setup(false);
    expect(screen.queryByRole('button', { name: 'Edit' })).toBeNull();
  });
});
