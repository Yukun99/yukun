import Section from '@/common/components/sections/section';
import SectionDividerHor from '@/common/components/sections/section-divider-hor';
import SectionDividerVert from '@/common/components/sections/section-divider-vert';
import SectionParagraph from '@/common/components/sections/section-paragraph';
import useIsMobile from '@/common/hooks/use-is-mobile';
import { useSpacing } from '@/pages/page';
import { PAGE } from '@/pages/resume/resume';
import Box from '@mui/material/Box';
import useMediaQuery from '@mui/material/useMediaQuery';
import { TFunction } from 'i18next';
import { useTranslation } from 'react-i18next';

function getJobComponent(t: TFunction, job: Job, isMobile: boolean, margin: number) {
  return (
    <Box key={job.company}>
      <SectionParagraph style={{ fontWeight: 'bold', textDecoration: 'underline' }}>
        {job.company}
      </SectionParagraph>
      <Box sx={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row' }}>
        <SectionParagraph>
          {job.position}
          {isMobile ? <br /> : ' '}
          {`[${job.period}]`}
        </SectionParagraph>
      </Box>
      {job.work.map((work) => (
        <Box key={`${job.company}-${work}`} sx={{ marginLeft: `${margin}px` }}>
          <SectionParagraph>{`${t('experience.point')} ${work}`}</SectionParagraph>
        </Box>
      ))}
      <SectionDividerHor />
    </Box>
  );
}

const WIDE_WIDTH = 2000;

type Job = { company: string; period: string; position: string; work: string[] };
const ExperienceSection = () => {
  const { t } = useTranslation(PAGE);
  const isMobile = useIsMobile();
  const { margin } = useSpacing();
  const isWide = useMediaQuery(`(min-width:${WIDE_WIDTH}px)`);

  const jobs = t('experience.jobs', { returnObjects: true }) as Job[];

  return (
    <Section page={PAGE} title={'experience'}>
      <Box sx={{ display: 'flex', flexDirection: 'row', width: '100%' }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            width: isWide ? `calc(50% - ${margin}px)` : '100%',
          }}
        >
          {(isWide ? jobs.slice(0, jobs.length / 2) : jobs).map((job) =>
            getJobComponent(t, job, isMobile, margin),
          )}
        </Box>
        {isWide && <SectionDividerVert />}
        {isWide && (
          <Box sx={{ display: 'flex', flexDirection: 'column', width: `calc(50% - ${margin}px)` }}>
            {jobs
              .slice(jobs.length / 2, jobs.length)
              .map((job) => getJobComponent(t, job, isMobile, margin))}
          </Box>
        )}
      </Box>
    </Section>
  );
};

export default ExperienceSection;
