import { FunctionComponent, ReactNode } from 'react';
import Box from '@mui/material/Box';
import ReactCountryFlag from 'react-country-flag';
import Typography from '@mui/material/Typography';
import ReactOriginal from 'devicons-react/icons/ReactOriginal';
import ReactrouterOriginal from 'devicons-react/icons/ReactrouterOriginal';
import ReduxOriginal from 'devicons-react/icons/ReduxOriginal';
import Rspack from '@/assets/resume/Rspack.svg';
import Nx from '@/assets/resume/Nx.svg';
import WebpackOriginal from 'devicons-react/icons/WebpackOriginal';
import ModuleFederation from '@/assets/resume/ModuleFederation.png';
import MaterialuiOriginal from 'devicons-react/icons/MaterialuiOriginal';
import JestPlain from 'devicons-react/icons/JestPlain';
import NodejsOriginal from 'devicons-react/icons/NodejsOriginal';
import SectionTitle from '@/common/components/sections/section-title';
import Section from '@/common/components/sections/section';
import { isMobileOnly } from 'react-device-detect';
import SectionDividerHor from '@/common/components/sections/section-divider-hor';

const RspackOriginal: FunctionComponent<{ size?: number | string }> = ({ size }) => (
  <img src={Rspack} style={{ width: size, height: size }} alt='Rspack' />
);
const NxOriginal: FunctionComponent<{ size?: number | string }> = ({ size }) => (
  <img src={Nx} style={{ width: size, height: size }} alt='Nx' />
);
const ModuleFederationOriginal: FunctionComponent<{ size?: number | string }> = ({ size }) => (
  <img src={ModuleFederation} style={{ width: size, height: size }} alt='MF' />
);

export type Skill = { name: string } & Language & Technical;
export enum SkillType {
  LANGUAGE,
  TECHNICAL,
  INTEREST,
}
type Language = { level?: string };
type Technical = { duration?: string; confidence?: string; icon?: string };

export const getDialogContent: Record<SkillType, (skill: Skill) => ReactNode | undefined> = {
  [SkillType.LANGUAGE]: () => undefined,
  [SkillType.TECHNICAL]: getTechnicalDialogContent,
  [SkillType.INTEREST]: () => undefined,
};

function getTechnicalDialogContent(skill: Skill): ReactNode {
  const ButtonIcon = nameIconMap[skill.icon!];
  return (
    <Section centered>
      <SectionTitle message={skill.name} variant='h5' />
      <SectionDividerHor />
      <ButtonIcon size={isMobileOnly ? '40%' : '20%'} />
      <Box sx={{ display: 'flex', flexDirection: isMobileOnly ? 'column' : 'row' }}>
        <Section centered>
          <SectionTitle message={'Experience'} variant='h5' />
          {skill.duration}
        </Section>
        <Section centered>
          <SectionTitle message={'Proficiency'} variant='h5' />
          {skill.confidence}
        </Section>
      </Box>
    </Section>
  );
}

export const getButtonContent: Record<SkillType, (skill: Skill) => ReactNode> = {
  [SkillType.LANGUAGE]: (skill) => getLanguageButtonContent(skill.name, skill.level!),
  [SkillType.TECHNICAL]: (skill) => getTechnicalButtonContent(skill.name, skill.icon!),
  [SkillType.INTEREST]: () => <></>,
};

type ButtonContentContainerProps = { children: ReactNode };
const ButtonContentContainer = ({ children }: ButtonContentContainerProps) => (
  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: '4%' }}>
    {children}
  </Box>
);

type ButtonContentLabelProps = { children: ReactNode };
const ButtonContentLabel = ({ children }: ButtonContentLabelProps) => {
  return (
    <Typography
      variant='body2'
      sx={{ paddingTop: '5%', color: 'text.primary', textTransform: 'capitalize' }}
    >
      {children}
    </Typography>
  );
};

function getLanguageButtonContent(language: string, level: string): ReactNode {
  const countryCodeMap: Record<string, string> = { English: 'GB', Chinese: 'CN' };
  return (
    <ButtonContentContainer>
      <ReactCountryFlag
        countryCode={countryCodeMap[language]}
        svg
        style={{ width: '75%', height: 'auto', objectFit: 'contain' }}
      />
      <ButtonContentLabel>
        {language}
        {<br />}
        {level}
      </ButtonContentLabel>
    </ButtonContentContainer>
  );
}

const nameIconMap: Record<string, FunctionComponent<{ size?: number | string }>> = {
  react: ReactOriginal,
  router: ReactrouterOriginal,
  redux: ReduxOriginal,
  rspack: RspackOriginal,
  nx: NxOriginal,
  webpack: WebpackOriginal,
  moduleFederation: ModuleFederationOriginal,
  materialUI: MaterialuiOriginal,
  jest: JestPlain,
  nodejs: NodejsOriginal,
};
function getTechnicalButtonContent(name: string, icon: string): ReactNode {
  const ButtonIcon = nameIconMap[icon];
  return (
    <ButtonContentContainer>
      <ButtonIcon size={isMobileOnly ? '50%' : '65%'} />
      <ButtonContentLabel>{name}</ButtonContentLabel>
    </ButtonContentContainer>
  );
}