import SkillButton from '@/pages/resume/components/skill-button';
import SkillDialog from '@/pages/resume/components/skill-dialog';
import { PAGE } from '@/pages/resume/utils/page';
import { SkillType, TechnicalSkill } from '@/pages/resume/utils/skill-types';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

const Week2Example = () => {
  const { t } = useTranslation(PAGE);
  const [skill, setSkill] = useState<TechnicalSkill | null>(null);

  const skills = t('skills.technical.frontend', { returnObjects: true }) as TechnicalSkill[];

  return (
    <>
      <SkillButton onSelect={setSkill} skill={skills[0]} skillType={SkillType.TECHNICAL} />
      <SkillDialog skill={skill} onClose={() => setSkill(null)} />
    </>
  );
};

export default Week2Example;
