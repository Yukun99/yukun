import Section from '@/common/components/sections/section';
import '@/locales/i18n';
import { render, screen } from '@testing-library/react';

const sectionOf = (container: HTMLElement) => container.firstElementChild as HTMLElement;

// jsdom drops properties it does not know from cssText, so the raw emotion rules are read instead
const cssOf = (element: HTMLElement) => {
  const styles = [...document.querySelectorAll('style')].map((style) => style.textContent).join('');
  return [...element.classList]
    .flatMap((name) => styles.match(new RegExp(`\\.${name}\\{[^}]*\\}`, 'g')) ?? [])
    .join(' ');
};

describe('Section', () => {
  it('should render its children', () => {
    render(<Section>hello</Section>);
    expect(screen.getByText('hello')).toBeTruthy();
  });

  it('should render the translated title only when page and title are given', () => {
    render(<Section page='home' title='intro' />);
    expect(screen.getByText('About Me')).toBeTruthy();
    render(<Section title='intro' />);
    expect(screen.getAllByText('About Me')).toHaveLength(1);
  });

  it('should drop the outer margin with noMargin', () => {
    const { container } = render(<Section noMargin />);
    expect(getComputedStyle(sectionOf(container)).margin).toBe('');
  });

  it('should keep the outer margin by default', () => {
    const { container } = render(<Section />);
    expect(getComputedStyle(sectionOf(container)).margin).toBe('16px');
  });

  it('should blur and tint only the frosted variant', () => {
    const frosted = cssOf(sectionOf(render(<Section />).container));
    expect(frosted).toContain('backdrop-filter:blur');
    expect(frosted).toContain('linear-gradient');
    const flat = cssOf(sectionOf(render(<Section variant='flat' />).container));
    expect(flat).not.toContain('backdrop-filter');
    expect(flat).toContain('linear-gradient');
    const clear = cssOf(sectionOf(render(<Section variant='clear' />).container));
    expect(clear).not.toContain('backdrop-filter');
    expect(clear).not.toContain('linear-gradient');
  });

  it('should merge sx over the defaults', () => {
    const { container } = render(<Section sx={{ margin: '3px' }} />);
    expect(getComputedStyle(sectionOf(container)).margin).toBe('3px');
  });
});
