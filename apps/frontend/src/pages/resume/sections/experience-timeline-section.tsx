import Section from '@/common/components/sections/section';
import SectionDividerHor from '@/common/components/sections/section-divider-hor';
import SectionParagraph from '@/common/components/sections/section-paragraph';
import Timeline, { TimelineEntry } from '@/common/components/timeline/timeline';
import useInView from '@/common/hooks/use-in-view';
import useIsMobile from '@/common/hooks/use-is-mobile';
import useScrollSnap from '@/common/hooks/use-scroll-snap';
import useSnapToLargest, { PANE_ATTRIBUTE } from '@/common/hooks/use-snap-to-largest';
import useTimelineProgress from '@/common/hooks/use-timeline-progress';
import useViewportSize from '@/common/hooks/use-viewport-size';
import SkeletonSection from '@/common/skeletons/sk-section';
import { useSpacing } from '@/pages/page';
import SkillPill from '@/pages/resume/components/skill-pill';
import { PAGE } from '@/pages/resume/resume';
import { DialogContentRenderer, TechnicalSkill } from '@/pages/resume/utils/skill-button-utils';
import Box from '@mui/material/Box';
import { ReactNode, useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';

type Job = { company: string; period: string; position: string; work: string[]; skills?: string[] };

const TECHNICAL_LISTS = ['frontend', 'backend', 'misc'];

// skills are listed by name in the job entries, so they need looking up in the skill lists
function useTechnicalSkills(): Map<string, TechnicalSkill> {
  const { t } = useTranslation(PAGE);

  return useMemo(() => {
    const skills = new Map<string, TechnicalSkill>();
    for (const list of TECHNICAL_LISTS) {
      const entries = t(`skills.technical.${list}`, { returnObjects: true }) as TechnicalSkill[];
      for (const skill of entries) {
        skills.set(skill.name, skill);
        skills.set(skill.icon, skill);
      }
    }
    return skills;
  }, [t]);
}

const getYear = (period: string) => period.match(/\d{4}/)?.[0] ?? period;

type JobPaneProps = {
  job: Job;
  minHeight: number | string;
  scrollable?: boolean;
  onSelectSkill: (renderer: DialogContentRenderer) => void;
};

// holds the empty frame until the pane is close enough to be worth mounting, then reveals it
const JobPane = ({ job, minHeight, scrollable, onSelectSkill }: JobPaneProps) => {
  const { t } = useTranslation(PAGE);
  const { margin } = useSpacing();
  const { ref, inView } = useInView<HTMLDivElement>();
  const technicalSkills = useTechnicalSkills();

  const skills = (job.skills ?? [])
    .map((name) => technicalSkills.get(name))
    .filter((skill) => skill !== undefined);

  return (
    <Box ref={ref} sx={{ display: 'flex', flex: 1, minWidth: 0, minHeight: 0 }}>
      <SkeletonSection minHeight={minHeight} style={{ flex: 1, display: 'flex', minWidth: 0 }}>
        {inView && (
          <Section
            reveal='mount'
            style={{ flex: 1, minHeight: 0, overflowY: scrollable ? 'auto' : undefined }}
            revealDuration={3000}
          >
            <SectionParagraph
              style={{ fontWeight: 'bold', textDecoration: 'underline', fontSize: '2rem' }}
            >
              {job.company}
            </SectionParagraph>
            <SectionParagraph>{`${job.position} [${job.period}]`}</SectionParagraph>
            {job.work.map((work) => (
              <Box key={work} sx={{ marginLeft: `${margin}px` }}>
                <SectionParagraph>{`${t('experience.point')} ${work}`}</SectionParagraph>
              </Box>
            ))}
            {skills.length > 0 && (
              <>
                <SectionDividerHor />
                <SectionParagraph>{t('experience.skillsUsed')}</SectionParagraph>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: `${margin}px` }}>
                  {skills.map((skill) => (
                    <SkillPill key={skill.name} skill={skill} onSelect={onSelectSkill} />
                  ))}
                </Box>
              </>
            )}
          </Section>
        )}
      </SkeletonSection>
    </Box>
  );
};

// panes shown after the timeline when the page scrolls sideways, i.e. the rest of the page
type ExperienceTimelineSectionProps = {
  onSelectSkill: (renderer: DialogContentRenderer) => void;
  trailing?: ReactNode[];
};

const ExperienceTimelineSection = ({
  onSelectSkill,
  trailing = [],
}: ExperienceTimelineSectionProps) => {
  const { t } = useTranslation(PAGE);
  const { margin } = useSpacing();
  const isMobile = useIsMobile();
  const { width: viewportWidth, height: viewportHeight } = useViewportSize();

  const jobs = t('experience.jobs', { returnObjects: true }) as Job[];
  const anchorRef = useRef<HTMLDivElement>(null);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const { progress, setItemRef } = useTimelineProgress(
    jobs.length,
    anchorRef,
    isMobile ? 'x' : 'y',
  );

  useScrollSnap();
  useSnapToLargest(isMobile ? 'x' : 'y', isMobile ? scrollerRef : undefined);

  // a pane fills the screen once the page's own margins are taken out
  const paneHeight = Math.max(viewportHeight - margin * 2, 0);
  const paneWidth = Math.max(viewportWidth - margin * 2, 0);

  const entries: TimelineEntry[] = jobs.map((job) => ({
    key: job.company,
    year: getYear(job.period),
    label: job.position,
  }));

  if (isMobile) {
    return (
      <Box
        sx={{ display: 'flex', flexDirection: 'column', width: '100%', height: `${paneHeight}px` }}
      >
        <Box
          ref={scrollerRef}
          sx={{ display: 'flex', flex: 1, minHeight: 0, overflowX: 'auto', overflowY: 'hidden' }}
        >
          <Box sx={{ display: 'flex', flexDirection: 'column', flexShrink: 0, height: '100%' }}>
            <Box
              ref={anchorRef}
              sx={{ position: 'sticky', left: 0, flexShrink: 0, width: `${paneWidth}px` }}
            >
              <Timeline entries={entries} progress={progress} orientation='horizontal' />
            </Box>
            <Box sx={{ display: 'flex', flex: 1, minHeight: 0, marginTop: `-${margin}px` }}>
              {jobs.map((job, index) => (
                <Box
                  key={job.company}
                  ref={setItemRef(index)}
                  {...{ [PANE_ATTRIBUTE]: true }}
                  sx={{ display: 'flex', flex: `0 0 ${paneWidth}px`, height: '100%', minHeight: 0 }}
                >
                  <JobPane job={job} minHeight={0} scrollable onSelectSkill={onSelectSkill} />
                </Box>
              ))}
            </Box>
          </Box>
          {trailing.map((pane, index) => (
            <Box
              key={index}
              {...{ [PANE_ATTRIBUTE]: true }}
              sx={{ display: 'flex', flex: `0 0 ${paneWidth}px`, height: '100%', minHeight: 0 }}
            >
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  flex: 1,
                  minWidth: 0,
                  minHeight: 0,
                }}
              >
                {pane}
              </Box>
            </Box>
          ))}
        </Box>
      </Box>
    );
  }

  return (
    // cancels the page's top margin so the first pane starts where the page top snap lands
    <Box sx={{ display: 'flex', width: '100%', marginTop: `-${margin}px` }}>
      <Timeline ref={anchorRef} entries={entries} progress={progress} />
      <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1, minWidth: 0 }}>
        {jobs.map((job, index) => (
          <Box
            key={job.company}
            ref={setItemRef(index)}
            {...{ [PANE_ATTRIBUTE]: true }}
            sx={{ display: 'flex', minHeight: `${viewportHeight}px` }}
          >
            <JobPane
              job={job}
              minHeight={viewportHeight - margin * 2}
              onSelectSkill={onSelectSkill}
            />
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default ExperienceTimelineSection;
