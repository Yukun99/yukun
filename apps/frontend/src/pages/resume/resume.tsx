import Page from '@/pages/page';
import Section from '@/common/components/sections/section';
import SectionParagraphByKey, {
  PLACEHOLDER_TYPE,
} from '@/common/components/sections/section-paragraph-by-key';
import Box from '@mui/material/Box';
import SectionDividerHor from '@/common/components/sections/section-divider-hor';
import { useTranslation } from 'react-i18next';
import SectionParagraph from '@/common/components/sections/section-paragraph';
import { useEffect, useState } from 'react';
import SectionDividerVert from '@/common/components/sections/section-divider-vert';
import { isMobileOnly } from 'react-device-detect';

type Job = { company: string; period: string; position: string; work: string[] };

const PAGE = 'resume';
const DOUBLE_WIDE_WIDTH = 2000;
const FLEX_DIRECTION = isMobileOnly ? 'column' : 'row';
const REVERSE_FLEX_DIRECTION = isMobileOnly ? 'column-reverse' : 'row';
const EDUCATION_WIDE_WIDTH = isMobileOnly ? undefined : '65%';
const EDUCATION_NARROW_WIDTH = isMobileOnly ? undefined : '25%';
const EDUCATION_NARROW_MARGIN = isMobileOnly ? undefined : 'auto';

const Resume = () => {
  const { t } = useTranslation(PAGE);
  const jobs = t('experience.jobs', { returnObjects: true }) as Job[];
  const [isDoubleWide, setIsDoubleWide] = useState<boolean>(false);

  function updateDoubleWide() {
    const currentWidth = window.innerWidth;
    if (currentWidth >= DOUBLE_WIDE_WIDTH && !isDoubleWide) return setIsDoubleWide(true);
    if (isDoubleWide) return setIsDoubleWide(false);
  }

  function getJobComponent(job: Job) {
    return (
      <Box key={job.company}>
        <SectionParagraph style={{ fontWeight: 'bold', textDecoration: 'underline' }}>
          {job.company}
        </SectionParagraph>
        <Box sx={{ display: 'flex', flexDirection: FLEX_DIRECTION }}>
          <SectionParagraph>{`${job.position} `}</SectionParagraph>
          <SectionParagraph>{`[${job.period}]`}</SectionParagraph>
        </Box>
        {job.work.map((work) => (
          <Box key={`${job.company}-${work}`} sx={{ marginLeft: '16px' }}>
            <SectionParagraph>{`${t('experience.point')} ${work}`}</SectionParagraph>
          </Box>
        ))}
        <SectionDividerHor />
      </Box>
    );
  }

  useEffect(() => updateDoubleWide(), []);
  window.addEventListener('resize', updateDoubleWide);

  return (
    <Page>
      <Box sx={{ display: 'flex', width: '100%', flexDirection: FLEX_DIRECTION }}>
        <Section page={PAGE} title='contact' width={isMobileOnly ? undefined : '50%'}>
          <SectionParagraphByKey
            page={PAGE}
            i18nKey={'contact.name'}
            textAlign='left'
            placeholders={[
              { name: 'name', i18nKey: 'common.name', placeholderType: PLACEHOLDER_TYPE.TEXT },
            ]}
          />
          <SectionParagraphByKey
            page={PAGE}
            i18nKey={'contact.mobile'}
            textAlign='left'
            placeholders={[
              { name: 'mobile', i18nKey: 'common.mobile', placeholderType: PLACEHOLDER_TYPE.TEXT },
            ]}
          />
          <SectionParagraphByKey
            page={PAGE}
            i18nKey='contact.email'
            textAlign='left'
            placeholders={[
              { name: 'email', i18nKey: 'common.email', placeholderType: PLACEHOLDER_TYPE.EMAIL },
            ]}
          />
          <SectionParagraphByKey
            page={PAGE}
            i18nKey='contact.github'
            textAlign='left'
            placeholders={[
              { name: 'github', i18nKey: 'common.github', placeholderType: PLACEHOLDER_TYPE.LINK },
            ]}
          />
          <SectionParagraphByKey
            page={PAGE}
            i18nKey='contact.website'
            textAlign='left'
            placeholders={[
              {
                name: 'website',
                i18nKey: 'common.website',
                placeholderType: PLACEHOLDER_TYPE.LINK,
              },
            ]}
          />
          <SectionParagraphByKey
            page={PAGE}
            i18nKey='contact.linkedin'
            textAlign='left'
            placeholders={[
              {
                name: 'linkedin',
                i18nKey: 'common.linkedin',
                placeholderType: PLACEHOLDER_TYPE.LINK,
              },
            ]}
          />
        </Section>
        <Section page={PAGE} title={'education'} width={isMobileOnly ? undefined : '50%'}>
          <SectionParagraphByKey
            page={PAGE}
            i18nKey={'education.hcltech.name'}
            style={{ fontWeight: 'bold', textDecoration: 'underline' }}
          />
          <Box sx={{ display: 'flex', flexDirection: REVERSE_FLEX_DIRECTION }}>
            <SectionParagraphByKey
              page={PAGE}
              i18nKey={'education.hcltech.programme'}
              style={{ maxWidth: EDUCATION_WIDE_WIDTH }}
            />
            <Box sx={{ marginLeft: EDUCATION_NARROW_MARGIN, maxWidth: EDUCATION_NARROW_WIDTH }}>
              <SectionParagraphByKey page={PAGE} i18nKey={'education.hcltech.period'} />
            </Box>
          </Box>
          <SectionDividerHor />
          <SectionParagraphByKey
            page={PAGE}
            i18nKey={'education.university.name'}
            style={{ fontWeight: 'bold', textDecoration: 'underline' }}
          />
          <Box sx={{ display: 'flex', flexDirection: REVERSE_FLEX_DIRECTION }}>
            <SectionParagraphByKey
              page={PAGE}
              i18nKey={'education.university.degree'}
              style={{ maxWidth: EDUCATION_WIDE_WIDTH }}
            />
            <Box sx={{ marginLeft: EDUCATION_NARROW_MARGIN, maxWidth: EDUCATION_NARROW_WIDTH }}>
              <SectionParagraphByKey page={PAGE} i18nKey={'education.university.period'} />
            </Box>
          </Box>
          <Box sx={{ display: 'flex', flexDirection: REVERSE_FLEX_DIRECTION }}>
            <SectionParagraphByKey
              page={PAGE}
              i18nKey={'education.university.focusAreas'}
              style={{ maxWidth: EDUCATION_WIDE_WIDTH }}
            />
            <Box sx={{ marginLeft: EDUCATION_NARROW_MARGIN, maxWidth: EDUCATION_NARROW_WIDTH }}>
              <SectionParagraphByKey page={PAGE} i18nKey={'education.university.CAP'} />
            </Box>
          </Box>
          <SectionDividerHor />
          <SectionParagraphByKey
            page={PAGE}
            i18nKey={'education.jc.name'}
            style={{ fontWeight: 'bold', textDecoration: 'underline' }}
          />
          <Box sx={{ display: 'flex', flexDirection: REVERSE_FLEX_DIRECTION }}>
            <SectionParagraphByKey
              page={PAGE}
              i18nKey={'education.jc.aLevels'}
              style={{ maxWidth: EDUCATION_WIDE_WIDTH }}
            />
            <Box sx={{ marginLeft: EDUCATION_NARROW_MARGIN, maxWidth: EDUCATION_NARROW_WIDTH }}>
              <SectionParagraphByKey page={PAGE} i18nKey={'education.jc.period'} />
            </Box>
          </Box>
          <SectionParagraphByKey page={PAGE} i18nKey={'education.jc.oLevels'} />
        </Section>
      </Box>
      <Section page={PAGE} title={'experience'}>
        <Box sx={{ display: 'flex', flexDirection: 'row', width: '100%' }}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              width: isDoubleWide ? 'calc(50% - 16px)' : '100%',
            }}
          >
            {(isDoubleWide ? jobs.slice(0, 2) : jobs).map((job) => getJobComponent(job))}
          </Box>
          {isDoubleWide && <SectionDividerVert />}
          {isDoubleWide && (
            <Box sx={{ display: 'flex', flexDirection: 'column', width: 'calc(50% - 16px)' }}>
              {jobs.slice(2, 4).map((job) => getJobComponent(job))}
            </Box>
          )}
        </Box>
      </Section>
    </Page>
  );
};

export default Resume;