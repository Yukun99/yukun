import Section from '@/common/components/sections/section';
import SectionParagraph from '@/common/components/sections/section-paragraph';
import Timeline, { TimelineEntry } from '@/common/components/timeline/timeline';
import useIsMobile from '@/common/hooks/use-is-mobile';
import useTimelineProgress from '@/common/hooks/use-timeline-progress';
import Box from '@mui/material/Box';
import { useRef } from 'react';

const PANE_WIDTH = 70;
const GUTTER = (100 - PANE_WIDTH) / 2;

const ENTRIES: (TimelineEntry & { blurb: string })[] = [
  { key: 'one', year: '2021', label: 'Intern', blurb: 'Learning with a side of pocket money.' },
  { key: 'two', year: '2022', label: 'Junior Dev', blurb: 'What is FE?' },
  { key: 'three', year: '2023', label: 'Developer', blurb: 'Where did my sleep go...' },
  { key: 'four', year: '2024', label: 'Senior Dev', blurb: 'Please check. Please fix. Formatting.' },
  { key: 'five', year: '2025', label: 'Lead', blurb: 'Idk meetings or something?' },
];

const Week9Example = () => {
  const isMobile = useIsMobile();
  const anchorRef = useRef<HTMLDivElement>(null);
  const { progress, setItemRef } = useTimelineProgress(ENTRIES.length, anchorRef, 'x');

  return (
    // the dial reads its centre off this box, so the panes have to scroll inside it
    <Box
      ref={anchorRef}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        height: isMobile ? '240px' : '340px',
      }}
    >
      <Timeline entries={ENTRIES} progress={progress} orientation='horizontal' />
      <Box
        sx={{
          display: 'flex',
          flex: 1,
          minHeight: 0,
          overflowX: 'auto',
          overflowY: 'hidden',
          scrollSnapType: 'x mandatory',
        }}
      >
        <Box sx={{ flex: `0 0 ${GUTTER}%` }} />
        {ENTRIES.map((entry, index) => (
          <Box
            key={entry.key}
            ref={setItemRef(index)}
            sx={{
              display: 'flex',
              flex: `0 0 ${PANE_WIDTH}%`,
              minHeight: 0,
              scrollSnapAlign: 'center',
            }}
          >
            <Section centered style={{ flex: 1, minWidth: 0 }}>
              <SectionParagraph style={{ fontWeight: 'bold', fontSize: '1.5rem' }} noGap>
                {entry.label}
              </SectionParagraph>
              <SectionParagraph textAlign='center' noGap>
                {entry.blurb}
              </SectionParagraph>
            </Section>
          </Box>
        ))}
        <Box sx={{ flex: `0 0 ${GUTTER}%` }} />
      </Box>
    </Box>
  );
};

export default Week9Example;