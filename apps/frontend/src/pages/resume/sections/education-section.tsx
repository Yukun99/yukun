import Section from '@/common/components/sections/section';
import SectionDividerHor from '@/common/components/sections/section-divider-hor';
import SectionParagraphByKey from '@/common/components/sections/section-paragraph-by-key';
import SectionParagraphList from '@/common/components/sections/section-paragraph-list';
import { PAGE } from '@/pages/resume/resume';
import Box from '@mui/material/Box';
import type { Theme } from '@mui/material/styles';
import type { SystemStyleObject } from '@mui/system';

type EducationSectionProps = { style?: SystemStyleObject<Theme> };

const EducationSection = ({ style }: EducationSectionProps) => {
  const EDUCATION_WIDE_WIDTH = '65%';
  const EDUCATION_NARROW_WIDTH = '25%';

  return (
    <Section page={PAGE} title={'education'} width='50%' style={style}>
      <SectionParagraphByKey
        page={PAGE}
        i18nKey={'education.hcltech.name'}
        style={{ fontWeight: 'bold', textDecoration: 'underline' }}
      />
      <Box sx={{ display: 'flex' }}>
        <SectionParagraphByKey
          page={PAGE}
          i18nKey={'education.hcltech.programme'}
          style={{ maxWidth: EDUCATION_WIDE_WIDTH }}
        />
        <Box sx={{ marginLeft: 'auto', maxWidth: EDUCATION_NARROW_WIDTH }}>
          <SectionParagraphByKey page={PAGE} i18nKey={'education.hcltech.period'} />
        </Box>
      </Box>
      <SectionDividerHor />
      <SectionParagraphByKey
        page={PAGE}
        i18nKey={'education.university.name'}
        style={{ fontWeight: 'bold', textDecoration: 'underline' }}
      />
      <Box sx={{ display: 'flex' }}>
        <SectionParagraphByKey
          page={PAGE}
          i18nKey={'education.university.degree'}
          style={{ maxWidth: EDUCATION_WIDE_WIDTH }}
        />
        <Box sx={{ marginLeft: 'auto', maxWidth: EDUCATION_NARROW_WIDTH }}>
          <SectionParagraphByKey page={PAGE} i18nKey={'education.university.period'} />
        </Box>
      </Box>
      <Box sx={{ display: 'flex' }}>
        <SectionParagraphList
          page={PAGE}
          labelKey={'education.university.focusAreasLabel'}
          i18nKey={'education.university.focusAreas'}
          style={{ maxWidth: EDUCATION_WIDE_WIDTH }}
        />
        <Box sx={{ marginLeft: 'auto', maxWidth: EDUCATION_NARROW_WIDTH }}>
          <SectionParagraphByKey page={PAGE} i18nKey={'education.university.CAP'} />
        </Box>
      </Box>
      <SectionDividerHor />
      <SectionParagraphByKey
        page={PAGE}
        i18nKey={'education.jc.name'}
        style={{ fontWeight: 'bold', textDecoration: 'underline' }}
      />
      <Box sx={{ display: 'flex' }}>
        <SectionParagraphList
          page={PAGE}
          labelKey={'education.jc.aLevelsLabel'}
          i18nKey={'education.jc.aLevels'}
          style={{ maxWidth: EDUCATION_WIDE_WIDTH }}
        />
        <Box sx={{ marginLeft: 'auto', maxWidth: EDUCATION_NARROW_WIDTH }}>
          <SectionParagraphByKey page={PAGE} i18nKey={'education.jc.period'} />
        </Box>
      </Box>
      <SectionParagraphByKey page={PAGE} i18nKey={'education.jc.oLevels'} />
    </Section>
  );
};

export default EducationSection;
