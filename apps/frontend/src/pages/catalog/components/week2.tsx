import useIsMobile from '@/common/hooks/use-is-mobile';
import SkillButton from '@/pages/resume/components/skill-button';
import SkillDialog from '@/pages/resume/components/skill-dialog';
import { PAGE } from '@/pages/resume/resume';
import {
  DialogContentRenderer,
  SkillType,
  TechnicalSkill,
} from '@/pages/resume/utils/skill-button-utils';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

const Week2Example = () => {
  const { t } = useTranslation(PAGE);

  const onSelect = (renderer: DialogContentRenderer) => setContent(() => renderer);
  const skills = t('skills.technical.frontend', { returnObjects: true }) as TechnicalSkill[];

  const isMobile = useIsMobile();
  const [content, setContent] = useState<DialogContentRenderer | null>(null);

  return (
    <>
      <SkillButton onSelect={onSelect} skill={skills[0]} skillType={SkillType.TECHNICAL} />
      <SkillDialog content={content?.(isMobile)} onClose={() => setContent(null)} />
    </>
  );
};

export default Week2Example;