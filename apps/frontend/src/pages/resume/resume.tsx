import Page from '@/pages/page';
import Section from '@/common/components/sections/section';
import SectionParagraphByKey, {
  PLACEHOLDER_TYPE,
} from '@/common/components/sections/section-paragraph-by-key';
import Box from '@mui/material/Box';
import SectionDivider from '@/common/components/sections/section-divider';
import { useTranslation } from 'react-i18next';
import SectionParagraph from '@/common/components/sections/section-paragraph';

type Company = { company: string; period: string; position: string; work: string[] };

const PAGE = 'resume';

const Resume = () => {
  const { t } = useTranslation(PAGE);
  const jobs = t('experience.jobs', { returnObjects: true }) as Company[];
  return (
    <Page>
      <Box sx={{ display: 'flex', flexDirection: 'row' }}>
        <Section page={PAGE} title='contact' width='50%'>
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
        <Section page={PAGE} title={'education'} width='50%'>
          <SectionParagraphByKey
            page={PAGE}
            i18nKey={'education.hcltech.name'}
            style={{ fontWeight: 'bold', textDecoration: 'underline' }}
          />
          <Box sx={{ display: 'flex', flexDirection: 'row' }}>
            <SectionParagraphByKey page={PAGE} i18nKey={'education.hcltech.programme'} />
            <Box sx={{ marginLeft: 'auto' }}>
              <SectionParagraphByKey page={PAGE} i18nKey={'education.hcltech.period'} />
            </Box>
          </Box>
          <SectionDivider />
          <SectionParagraphByKey
            page={PAGE}
            i18nKey={'education.university.name'}
            style={{ fontWeight: 'bold', textDecoration: 'underline' }}
          />
          <Box sx={{ display: 'flex', flexDirection: 'row' }}>
            <SectionParagraphByKey page={PAGE} i18nKey={'education.university.degree'} />
            <Box sx={{ marginLeft: 'auto' }}>
              <SectionParagraphByKey page={PAGE} i18nKey={'education.university.period'} />
            </Box>
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'row' }}>
            <SectionParagraphByKey page={PAGE} i18nKey={'education.university.focusAreas'} />
            <Box sx={{ marginLeft: 'auto' }}>
              <SectionParagraphByKey page={PAGE} i18nKey={'education.university.CAP'} />
            </Box>
          </Box>
          <SectionDivider />
          <SectionParagraphByKey
            page={PAGE}
            i18nKey={'education.jc.name'}
            style={{ fontWeight: 'bold', textDecoration: 'underline' }}
          />
          <Box sx={{ display: 'flex', flexDirection: 'row' }}>
            <SectionParagraphByKey page={PAGE} i18nKey={'education.jc.aLevels'} />
            <Box sx={{ marginLeft: 'auto' }}>
              <SectionParagraphByKey page={PAGE} i18nKey={'education.jc.period'} />
            </Box>
          </Box>
          <SectionParagraphByKey page={PAGE} i18nKey={'education.jc.oLevels'} />
        </Section>
      </Box>
      <Section page={PAGE} title={'experience'}>
        {/*TODO: make this responsive by displaying 2 columns if page is wide enough, 1 if not*/}
        {/*basically, 2x2 grid if wide enough, 1x4 if not :)*/}
        {/*will also need a vertical divider component, maybe rename current one*/}
        {jobs.map((job) => (
          <Box key={job.company}>
            <SectionParagraph style={{ fontWeight: 'bold', textDecoration: 'underline' }}>
              {job.company}
            </SectionParagraph>
            <SectionParagraph>{`${job.position} [${job.period}]`}</SectionParagraph>
            {job.work.map((work) => (
              <Box key={`${job.company}-${work}`} sx={{ marginLeft: '16px' }}>
                <SectionParagraph>{`${t('experience.point')} ${work}`}</SectionParagraph>
              </Box>
            ))}
            <SectionDivider />
          </Box>
        ))}
      </Section>
    </Page>
  );
};

export default Resume;