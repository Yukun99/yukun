import Section from '@/common/components/sections/section';
import SectionAccordion from '@/common/components/sections/section-accordion';
import SectionAccordionGroup from '@/common/components/sections/section-accordion-group';
import SectionDividerHor from '@/common/components/sections/section-divider-hor';
import SectionParagraph from '@/common/components/sections/section-paragraph';
import SectionTitle from '@/common/components/sections/section-title';
import SkillButton from '@/pages/resume/components/skill-button';
import { PAGE } from '@/pages/resume/utils/page';
import {
  InterestSkill,
  LanguageSkill,
  SkillType,
  TechnicalSkill,
} from '@/pages/resume/utils/skill-types';
import Box from '@mui/material/Box';
import type { Theme } from '@mui/material/styles';
import type { SystemStyleObject } from '@mui/system';
import { useTranslation } from 'react-i18next';

type SkillsSectionProps = {
  onSelectSkill: (skill: TechnicalSkill) => void;
  style?: SystemStyleObject<Theme>;
};

const SkillsSection = ({ onSelectSkill, style }: SkillsSectionProps) => {
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

  return (
    <Section page={PAGE} title='skills' sx={{ overflow: 'hidden', ...style }}>
      <SectionAccordionGroup>
        <SectionAccordion
          title={'skills.languages'}
          page={PAGE}
        >
          {languageSkills.map((language) => (
            <SkillButton
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
        >
          {interests.map((interest) => (
            <SkillButton
              skill={interest}
              skillType={SkillType.INTEREST}
              key={interest.name}
            />
          ))}
        </SectionAccordion>
        <SectionDividerHor slim />
      </SectionAccordionGroup>
    </Section>
  );
};

export default SkillsSection;
