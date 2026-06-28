import Section from '@/common/components/sections/section';
import { PAGE } from '@/pages/resume/resume';
import SectionAccordion from '@/common/components/sections/section-accordion';
import { ReactNode, useState } from 'react';
import { Skill, SkillType } from '@/pages/resume/utils/skill-button-utils';
import { useTranslation } from 'react-i18next';
import SkillButton from '@/pages/resume/components/skill-button';
import SectionDividerHor from '@/common/components/sections/section-divider-hor';
import SectionParagraph from '@/common/components/sections/section-paragraph';
import Box from '@mui/material/Box';
import SectionTitle from '@/common/components/sections/section-title';

type SkillsSectionProps = { setSkillDialogContent: (content: ReactNode | undefined) => void };
const SkillsSection = ({ setSkillDialogContent }: SkillsSectionProps) => {
  const { t } = useTranslation(PAGE);

  const languageSkills = t('skills.languages.list', { returnObjects: true }) as Skill[];
  const technicalSkillsFE = t('skills.technical.frontend', { returnObjects: true }) as Skill[];
  const technicalSkillsBE = t('skills.technical.backend', { returnObjects: true }) as Skill[];
  const [expandedAccordion, setExpandedAccordion] = useState<number | undefined>(undefined);

  return (
    <Section page={PAGE} title='skills' style={{ overflow: 'hidden' }}>
      <SectionAccordion
        title={'skills.languages'}
        page={PAGE}
        accordionNumber={0}
        expandedAccordion={expandedAccordion}
        setExpandedAccordion={setExpandedAccordion}
      >
        {languageSkills.map((language) => (
          <SkillButton
            setSkillDialogContent={setSkillDialogContent}
            skill={language}
            skillType={SkillType.LANGUAGE}
            key={language.name}
          />
        ))}
      </SectionAccordion>
      <SectionDividerHor slim />
      <SectionAccordion
        title={'skills.technical'}
        page={PAGE}
        accordionNumber={1}
        expandedAccordion={expandedAccordion}
        setExpandedAccordion={setExpandedAccordion}
      >
        <Section page={PAGE} centered>
          <SectionTitle page={PAGE} message={t('skills.technical.frontendTitle')} variant='h6' />
          <SectionParagraph style={{ color: 'text.secondary' }}>
            {t('skills.technical.click')}
          </SectionParagraph>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
            {technicalSkillsFE.map((frontend) => (
              <SkillButton
                setSkillDialogContent={setSkillDialogContent}
                skill={frontend}
                skillType={SkillType.TECHNICAL}
                key={frontend.name}
              />
            ))}
          </Box>
        </Section>
        {technicalSkillsBE.map((backend) => (
          <SkillButton
            setSkillDialogContent={setSkillDialogContent}
            skill={backend}
            skillType={SkillType.TECHNICAL}
            key={backend.name}
          />
        ))}
      </SectionAccordion>
      <SectionDividerHor slim />
      <SectionAccordion
        title={'skills.interests'}
        page={PAGE}
        accordionNumber={2}
        expandedAccordion={expandedAccordion}
        setExpandedAccordion={setExpandedAccordion}
      >
        {'Under Construction'}
      </SectionAccordion>
      <SectionDividerHor slim />
    </Section>
  );
};

export default SkillsSection;