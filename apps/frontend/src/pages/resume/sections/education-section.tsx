import { isMobileOnly } from 'react-device-detect';
import SectionParagraphByKey from '@/common/components/sections/section-paragraph-by-key';
import Box from '@mui/material/Box';
import SectionDividerHor from '@/common/components/sections/section-divider-hor';
import Section from '@/common/components/sections/section';
import { PAGE } from '@/pages/resume/resume';

const REVERSE_FLEX_DIRECTION = isMobileOnly ? 'column-reverse' : 'row';
const EDUCATION_WIDE_WIDTH = isMobileOnly ? undefined : '65%';
const EDUCATION_NARROW_WIDTH = isMobileOnly ? undefined : '25%';
const EDUCATION_NARROW_MARGIN = isMobileOnly ? undefined : 'auto';

const EducationSection = () => {
  return (
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
  );
};

export default EducationSection;