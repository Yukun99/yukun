import Section from '@/common/components/sections/section';
import SectionDividerHor from '@/common/components/sections/section-divider-hor';
import SectionDividerVert from '@/common/components/sections/section-divider-vert';
import SectionParagraph from '@/common/components/sections/section-paragraph';
import { GLOBAL_MARGIN } from '@/pages/page';
import { FLEX_DIRECTION, PAGE } from '@/pages/resume/resume';
import Box from '@mui/material/Box';
import { TFunction } from 'i18next';
import { useEffect, useState } from 'react';
import { isMobileOnly } from 'react-device-detect';
import { useTranslation } from 'react-i18next';

function getJobComponent(t: TFunction, job: Job) {
  return (
    <Box key={job.company}>
      <SectionParagraph style={{ fontWeight: 'bold', textDecoration: 'underline' }}>
        {job.company}
      </SectionParagraph>
      <Box sx={{ display: 'flex', flexDirection: FLEX_DIRECTION }}>
        <SectionParagraph>
          {job.position}
          {isMobileOnly ? <br /> : ' '}
          {`[${job.period}]`}
        </SectionParagraph>
      </Box>
      {job.work.map((work) => (
        <Box key={`${job.company}-${work}`} sx={{ marginLeft: `${GLOBAL_MARGIN}px` }}>
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

  const jobs = t('experience.jobs', { returnObjects: true }) as Job[];
  const [isWide, setisWide] = useState<boolean>(false);

  function updateIsWide() {
    const currentWidth = window.innerWidth;
    if (currentWidth >= WIDE_WIDTH && !isWide) return setisWide(true);
    if (isWide) return setisWide(false);
  }

  useEffect(() => updateIsWide(), []);
  window.addEventListener('resize', updateIsWide);

  return (
    <Section page={PAGE} title={'experience'}>
      <Box sx={{ display: 'flex', flexDirection: 'row', width: '100%' }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            width: isWide ? `calc(50% - ${GLOBAL_MARGIN}px)` : '100%',
          }}
        >
          {(isWide ? jobs.slice(0, jobs.length / 2) : jobs).map((job) => getJobComponent(t, job))}
        </Box>
        {isWide && <SectionDividerVert />}
        {isWide && (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              width: `calc(50% - ${GLOBAL_MARGIN}px)`,
            }}
          >
            {jobs.slice(jobs.length / 2, jobs.length).map((job) => getJobComponent(t, job))}
          </Box>
        )}
      </Box>
    </Section>
  );
};

export default ExperienceSection;