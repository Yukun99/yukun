import IdeaDialog from '@/pages/ideas/components/idea-dialog';
import { MAX_TITLE } from '@/pages/ideas/utils/ideas';
import '@/locales/i18n';
import { fireEvent, render, screen } from '@testing-library/react';

const idea = { title: 'Hey', content: 'Body' };

describe('IdeaDialog', () => {
  it('should count the title characters against the limit when editable', () => {
    render(<IdeaDialog idea={idea} editable onChange={() => undefined} onClose={() => undefined} />);
    expect(screen.getByText(`3/${MAX_TITLE}`)).toBeTruthy();
  });

  it('should turn the counter red once the title is full', () => {
    const full = { ...idea, title: 'x'.repeat(MAX_TITLE) };
    render(<IdeaDialog idea={full} editable onChange={() => undefined} onClose={() => undefined} />);
    const red = getComputedStyle(screen.getByText(`${MAX_TITLE}/${MAX_TITLE}`)).color;
    render(<IdeaDialog idea={idea} editable onChange={() => undefined} onClose={() => undefined} />);
    const plain = getComputedStyle(screen.getByText(`3/${MAX_TITLE}`)).color;
    expect(red).toBe('rgb(211, 47, 47)');
    expect(plain).not.toBe(red);
  });

  it('should report edits to the title', () => {
    const onChange = vi.fn();
    render(<IdeaDialog idea={idea} editable onChange={onChange} onClose={() => undefined} />);
    fireEvent.change(screen.getByLabelText('Title'), { target: { value: 'Hello' } });
    expect(onChange).toHaveBeenCalledWith({ title: 'Hello', content: 'Body' });
  });

  it('should show plain text without a counter when read only', () => {
    render(
      <IdeaDialog idea={idea} editable={false} onChange={() => undefined} onClose={() => undefined} />,
    );
    expect(screen.getByText('Hey')).toBeTruthy();
    expect(screen.queryByText(`3/${MAX_TITLE}`)).toBeNull();
  });
});
