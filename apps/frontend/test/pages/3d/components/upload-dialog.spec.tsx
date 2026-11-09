import '@/locales/i18n';
import UploadDialog from '@/pages/3d/components/upload-dialog';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { Group } from 'three';

vi.mock('@/pages/3d/components/model-viewer', () => ({ default: () => <div /> }));
vi.mock('@/pages/3d/utils/load-three-mf', () => ({
  loadThreeMf: () => Promise.resolve([new Group()]),
}));
vi.mock('@/pages/3d/utils/glb', () => ({ toGlb: () => Promise.resolve(new ArrayBuffer(4)) }));
vi.mock('@/pages/3d/utils/thumbnail', () => ({
  renderThumbnail: () => Promise.resolve(new ArrayBuffer(8)),
}));

const LINK = 'https://makerworld.com/en/models/1';
const model = {
  id: 1,
  name: 'Benchy',
  link: LINK,
  size: 4,
  createdAt: 1,
  updatedAt: 1,
  thumbnail: false,
  source: false,
};

const setup = (editing: typeof model | null, onUpdate = vi.fn().mockResolvedValue(true)) => {
  const props = {
    onClose: vi.fn(),
    onUpload: vi.fn(),
    onUpdate,
    onReplace: vi.fn().mockResolvedValue(true),
  };
  const { container } = render(<UploadDialog open model={editing} {...props} />);
  const pick = () => {
    const source = new ArrayBuffer(3);
    const file = { name: 'new.3mf', size: 3, arrayBuffer: () => Promise.resolve(source) };
    const input = container.ownerDocument.querySelector('input[type=file]') as HTMLInputElement;
    fireEvent.change(input, { target: { files: [file] } });
    return source;
  };
  return { ...props, pick };
};

const save = () => screen.getByRole('button', { name: 'Save' });
const type = (label: string, value: string) =>
  fireEvent.change(screen.getByLabelText(label), { target: { value } });

describe('UploadDialog', () => {
  it('should show the upload heading and a disabled save without a file', () => {
    setup(null);
    expect(screen.getByText('Upload Model')).toBeTruthy();
    expect((save() as HTMLButtonElement).disabled).toBe(true);
  });

  it('should prefill the fields in edit mode and enable save once something changes', () => {
    setup(model);
    expect(screen.getByText('Edit Model')).toBeTruthy();
    expect((screen.getByLabelText('Name') as HTMLInputElement).value).toBe('Benchy');
    expect((screen.getByLabelText('MakerWorld link (optional)') as HTMLInputElement).value).toBe(LINK);
    expect((save() as HTMLButtonElement).disabled).toBe(true);
    type('Name', 'New name');
    expect((save() as HTMLButtonElement).disabled).toBe(false);
  });

  it('should update the model and close on save', async () => {
    const props = setup(model);
    type('Name', 'New name');
    fireEvent.click(save());
    await waitFor(() => expect(props.onClose).toHaveBeenCalledOnce());
    expect(props.onUpdate).toHaveBeenCalledWith(1, 'New name', LINK);
  });

  it('should show an error when the update fails', async () => {
    const props = setup(model, vi.fn().mockResolvedValue(false));
    type('Name', 'New name');
    fireEvent.click(save());
    expect(await screen.findByText('Could not save changes')).toBeTruthy();
    expect(props.onClose).not.toHaveBeenCalled();
  });

  it('should send an empty link when it is cleared', async () => {
    const props = setup(model);
    type('MakerWorld link (optional)', '');
    fireEvent.click(save());
    await waitFor(() => expect(props.onUpdate).toHaveBeenCalledWith(1, 'Benchy', ''));
  });

  it('should replace the file without a PATCH when only a file is picked, then reload', async () => {
    const reload = vi.fn();
    vi.stubGlobal('location', { ...window.location, reload });
    const props = setup(model);
    const source = props.pick();
    await waitFor(() => expect((save() as HTMLButtonElement).disabled).toBe(false));
    fireEvent.click(save());
    await waitFor(() => expect(reload).toHaveBeenCalledOnce());
    expect(props.onUpdate).not.toHaveBeenCalled();
    expect(props.onReplace).toHaveBeenCalledWith(1, expect.any(ArrayBuffer), expect.any(ArrayBuffer), source);
    vi.unstubAllGlobals();
  });

  it('should not reload when the file replace fails', async () => {
    const reload = vi.fn();
    vi.stubGlobal('location', { ...window.location, reload });
    const props = setup(model);
    props.onReplace.mockResolvedValue(false);
    props.pick();
    await waitFor(() => expect((save() as HTMLButtonElement).disabled).toBe(false));
    fireEvent.click(save());
    expect(await screen.findByText('Could not save changes')).toBeTruthy();
    expect(reload).not.toHaveBeenCalled();
    vi.unstubAllGlobals();
  });
});
