import SectionDialog from '@/common/components/sections/section-dialog';
import '@/locales/i18n';
import { render, screen } from '@testing-library/react';

// jsdom drops properties it does not know from cssText, so the raw emotion rules are read instead
const cssOf = (element: HTMLElement) => {
  const styles = [...document.querySelectorAll('style')].map((style) => style.textContent).join('');
  return [...element.classList]
    .flatMap((name) => styles.match(new RegExp(`\\.${name}\\{[^}]*\\}`, 'g')) ?? [])
    .join(' ');
};

describe('SectionDialog', () => {
  it('should render its children when open', () => {
    render(
      <SectionDialog open onClose={() => undefined}>
        hello
      </SectionDialog>,
    );
    expect(screen.getByText('hello')).toBeTruthy();
  });

  it('should render nothing when closed', () => {
    render(
      <SectionDialog open={false} onClose={() => undefined}>
        hello
      </SectionDialog>,
    );
    expect(screen.queryByText('hello')).toBeNull();
  });

  it('should blur the paper', () => {
    render(
      <SectionDialog open onClose={() => undefined}>
        hello
      </SectionDialog>,
    );
    const paper = document.querySelector('.MuiDialog-paper') as HTMLElement;
    expect(cssOf(paper)).toContain('backdrop-filter:blur');
  });
});
