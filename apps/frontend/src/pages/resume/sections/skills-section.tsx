import Section from '@/common/components/sections/section';
import SectionAccordion from '@/common/components/sections/section-accordion';
import SectionDividerHor from '@/common/components/sections/section-divider-hor';
import SectionParagraph from '@/common/components/sections/section-paragraph';
import SectionTitle from '@/common/components/sections/section-title';
import SkillButton from '@/pages/resume/components/skill-button';
import { PAGE } from '@/pages/resume/resume';
import {
  DialogContentRenderer,
  InterestSkill,
  LanguageSkill,
  SkillType,
  TechnicalSkill,
} from '@/pages/resume/utils/skill-button-utils';
import Box from '@mui/material/Box';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

type SkillsSectionProps = { onSelectSkill: (renderer: DialogContentRenderer) => void };

const SkillsSection = ({ onSelectSkill }: SkillsSectionProps) => {
  const { t } = useTranslation(PAGE);

  const languageSkills = t('skills.languages.list', { returnObjects: true }) as LanguageSkill[];
  const technicalSkillsFE = t('skills.technical.frontend', {
    returnObjects: true,
  }) as TechnicalSkill[];
  const technicalSkillsBE = t('skills.technical.backend', {
    returnObjects: true,
  }) as TechnicalSkill[];
  const technicalSkillsMisc = t('skills.technical.misc', {
    returnObjects: true,
  }) as TechnicalSkill[];
  const interests = t('skills.interests.list', { returnObjects: true }) as InterestSkill[];

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
            onSelect={onSelectSkill}
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
        centered
        column
      >
        <Section page={PAGE} centered>
          <SectionTitle page={PAGE} message={t('skills.technical.frontendTitle')} variant='h6' />
          <SectionParagraph style={{ color: 'text.secondary' }}>
            {t('skills.technical.click')}
          </SectionParagraph>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
            {technicalSkillsFE.map((frontend) => (
              <SkillButton
                onSelect={onSelectSkill}
                skill={frontend}
                skillType={SkillType.TECHNICAL}
                key={frontend.name}
              />
            ))}
          </Box>
        </Section>
        <Section page={PAGE} centered>
          <SectionTitle page={PAGE} message={t('skills.technical.backendTitle')} variant='h6' />
          <SectionParagraph style={{ color: 'text.secondary' }}>
            {t('skills.technical.click')}
          </SectionParagraph>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
            {technicalSkillsBE.map((backend) => (
              <SkillButton
                onSelect={onSelectSkill}
                skill={backend}
                skillType={SkillType.TECHNICAL}
                key={backend.name}
              />
            ))}
          </Box>
        </Section>
        <Section page={PAGE} centered>
          <SectionTitle page={PAGE} message={t('skills.technical.miscTitle')} variant='h6' />
          <SectionParagraph style={{ color: 'text.secondary' }}>
            {t('skills.technical.click')}
          </SectionParagraph>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
            {technicalSkillsMisc.map((misc) => (
              <SkillButton
                onSelect={onSelectSkill}
                skill={misc}
                skillType={SkillType.TECHNICAL}
                key={misc.name}
              />
            ))}
          </Box>
        </Section>
      </SectionAccordion>
      <SectionDividerHor slim />
      <SectionAccordion
        title={'skills.interests'}
        page={PAGE}
        accordionNumber={2}
        expandedAccordion={expandedAccordion}
        setExpandedAccordion={setExpandedAccordion}
      >
        {interests.map((interest) => (
          <SkillButton
            onSelect={onSelectSkill}
            skill={interest}
            skillType={SkillType.INTEREST}
            key={interest.name}
          />
        ))}
      </SectionAccordion>
      <SectionDividerHor slim />
    </Section>
  );
};

export default SkillsSection;