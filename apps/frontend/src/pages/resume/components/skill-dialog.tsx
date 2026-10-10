import SectionDialog from '@/common/components/sections/section-dialog';
import SkillDialogContent from '@/pages/resume/components/skill-dialog-content';
import { TechnicalSkill } from '@/pages/resume/utils/skill-types';

type SkillDialogProps = { skill: TechnicalSkill | null; onClose: () => void };

const SkillDialog = ({ skill, onClose }: SkillDialogProps) => (
  <SectionDialog open={Boolean(skill)} onClose={onClose}>
    {skill && <SkillDialogContent skill={skill} />}
  </SectionDialog>
);

export default SkillDialog;
