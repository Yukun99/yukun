import SectionAccordion from '@/common/components/sections/section-accordion';
import SectionAccordionGroup from '@/common/components/sections/section-accordion-group';
import '@/locales/i18n';
import { fireEvent, render, screen } from '@testing-library/react';

const renderGroup = () =>
  render(
    <SectionAccordionGroup>
      <SectionAccordion page='resume' title='skills.languages'>
        languages body
      </SectionAccordion>
      <SectionAccordion page='resume' title='skills.interests'>
        interests body
      </SectionAccordion>
    </SectionAccordionGroup>,
  );

const isExpanded = (name: string) =>
  screen.getByRole('button', { name }).getAttribute('aria-expanded') === 'true';

describe('SectionAccordionGroup', () => {
  it('should start with every accordion collapsed', () => {
    renderGroup();
    expect(isExpanded('Languages')).toBe(false);
    expect(isExpanded('Interests')).toBe(false);
  });

  it('should expand the clicked accordion and collapse the other one', () => {
    renderGroup();
    fireEvent.click(screen.getByText('Languages'));
    expect(isExpanded('Languages')).toBe(true);
    expect(isExpanded('Interests')).toBe(false);
    fireEvent.click(screen.getByText('Interests'));
    expect(isExpanded('Languages')).toBe(false);
    expect(isExpanded('Interests')).toBe(true);
  });

  it('should collapse an expanded accordion when clicked again', () => {
    renderGroup();
    fireEvent.click(screen.getByText('Languages'));
    fireEvent.click(screen.getByText('Languages'));
    expect(isExpanded('Languages')).toBe(false);
  });

  it('should throw when an accordion is rendered outside a group', () => {
    vi.spyOn(console, 'error').mockImplementation(() => undefined);
    expect(() =>
      render(
        <SectionAccordion page='resume' title='skills.languages'>
          alone
        </SectionAccordion>,
      ),
    ).toThrow('SectionAccordion must be inside SectionAccordionGroup');
  });
});
