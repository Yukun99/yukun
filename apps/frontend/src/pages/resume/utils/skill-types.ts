export enum SkillType {
  LANGUAGE,
  TECHNICAL,
  INTEREST,
}

export type LanguageSkill = { name: string; level: string; code: string };
export type TechnicalSkill = {
  name: string;
  icon: string;
  duration?: string;
  proficiency?: string;
};
export type InterestSkill = { name: string; icon: string };

export type SkillOf = {
  [SkillType.LANGUAGE]: LanguageSkill;
  [SkillType.TECHNICAL]: TechnicalSkill;
  [SkillType.INTEREST]: InterestSkill;
};
