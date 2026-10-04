import { createContext, ReactNode, useCallback, useContext, useMemo, useState } from 'react';

type AccordionGroup = {
  expanded: string | undefined;
  toggle: (title: string) => void;
};

const AccordionGroupContext = createContext<AccordionGroup | null>(null);

export const useAccordionGroup = () => {
  const group = useContext(AccordionGroupContext);
  if (!group) throw new Error('SectionAccordion must be inside SectionAccordionGroup');
  return group;
};

type SectionAccordionGroupProps = {
  children: ReactNode;
};

const SectionAccordionGroup = ({ children }: SectionAccordionGroupProps) => {
  const [expanded, setExpanded] = useState<string | undefined>(undefined);
  const toggle = useCallback(
    (title: string) => setExpanded((current) => (current === title ? undefined : title)),
    [],
  );
  const group = useMemo(() => ({ expanded, toggle }), [expanded, toggle]);

  return <AccordionGroupContext.Provider value={group}>{children}</AccordionGroupContext.Provider>;
};

export default SectionAccordionGroup;
