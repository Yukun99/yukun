import Claude from '@/assets/resume/Claude.svg';
import ModuleFederation from '@/assets/resume/ModuleFederation.png';
import Nx from '@/assets/resume/Nx.svg';
import Rspack from '@/assets/resume/Rspack.svg';
import { getFormattedIcon } from '@/common/components/buttons/round-icon-button';
import Section from '@/common/components/sections/section';
import SectionDividerHor from '@/common/components/sections/section-divider-hor';
import SectionTitle from '@/common/components/sections/section-title';
import { SvgIconComponent } from '@mui/icons-material';
import BugReportIcon from '@mui/icons-material/BugReport';
import CallMergeIcon from '@mui/icons-material/CallMerge';
import CodeIcon from '@mui/icons-material/Code';
import DescriptionIcon from '@mui/icons-material/Description';
import DevicesIcon from '@mui/icons-material/Devices';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import HandymanIcon from '@mui/icons-material/Handyman';
import KeyboardIcon from '@mui/icons-material/Keyboard';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import CplusplusOriginal from 'devicons-react/icons/CplusplusOriginal';
import CsharpOriginal from 'devicons-react/icons/CsharpOriginal';
import GitOriginal from 'devicons-react/icons/GitOriginal';
import GithubOriginal from 'devicons-react/icons/GithubOriginal';
import GitlabOriginal from 'devicons-react/icons/GitlabOriginal';
import HibernateOriginal from 'devicons-react/icons/HibernateOriginal';
import JavaOriginal from 'devicons-react/icons/JavaOriginal';
import JestPlain from 'devicons-react/icons/JestPlain';
import JunitOriginal from 'devicons-react/icons/JunitOriginal';
import KubernetesOriginal from 'devicons-react/icons/KubernetesOriginal';
import MaterialuiOriginal from 'devicons-react/icons/MaterialuiOriginal';
import MysqlOriginal from 'devicons-react/icons/MysqlOriginal';
import NodejsOriginal from 'devicons-react/icons/NodejsOriginal';
import QtOriginal from 'devicons-react/icons/QtOriginal';
import ReactOriginal from 'devicons-react/icons/ReactOriginal';
import ReactrouterOriginal from 'devicons-react/icons/ReactrouterOriginal';
import ReduxOriginal from 'devicons-react/icons/ReduxOriginal';
import SpringOriginal from 'devicons-react/icons/SpringOriginal';
import UnityOriginal from 'devicons-react/icons/UnityOriginal';
import WebpackOriginal from 'devicons-react/icons/WebpackOriginal';
import { FunctionComponent, ReactNode } from 'react';
import ReactCountryFlag from 'react-country-flag';

const RspackOriginal: FunctionComponent<{ size?: number | string }> = ({ size }) => (
  <img src={Rspack} style={{ width: size, height: size }} alt='Rspack' />
);
const NxOriginal: FunctionComponent<{ size?: number | string }> = ({ size }) => (
  <img src={Nx} style={{ width: size, height: size }} alt='Nx' />
);
const ModuleFederationOriginal: FunctionComponent<{ size?: number | string }> = ({ size }) => (
  <img src={ModuleFederation} style={{ width: size, height: size }} alt='MF' />
);
const ClaudeOriginal: FunctionComponent<{ size?: number | string }> = ({ size }) => (
  <img src={Claude} style={{ width: size, height: size }} alt='Claude' />
);
const BugReportIconOriginal: FunctionComponent<{ size?: number | string }> = ({ size }) => (
  <BugReportIcon style={{ width: size, height: size }} />
);
const DescriptionIconOriginal: FunctionComponent<{ size?: number | string }> = ({ size }) => (
  <DescriptionIcon style={{ width: size, height: size }} />
);
const CallMergeIconOriginal: FunctionComponent<{ size?: number | string }> = ({ size }) => (
  <CallMergeIcon style={{ width: size, height: size, transform: 'rotate(90deg)' }} />
);

export enum SkillType {
  LANGUAGE,
  TECHNICAL,
  INTEREST,
}

export type LanguageSkill = { name: string; level: string };
export type TechnicalSkill = { name: string; icon: string; duration?: string; confidence?: string };
export type InterestSkill = { name: string; icon: string };

export type SkillOf = {
  [SkillType.LANGUAGE]: LanguageSkill;
  [SkillType.TECHNICAL]: TechnicalSkill;
  [SkillType.INTEREST]: InterestSkill;
};

export type DialogContentRenderer = (isMobile: boolean) => ReactNode | undefined;

export const getDialogContent: {
  [K in SkillType]: (skill: SkillOf[K], isMobile: boolean) => ReactNode | undefined;
} = {
  [SkillType.LANGUAGE]: () => undefined,
  [SkillType.TECHNICAL]: getTechnicalDialogContent,
  [SkillType.INTEREST]: () => undefined,
};

function getTechnicalDialogContent(skill: TechnicalSkill, isMobile: boolean): ReactNode {
  const ButtonIcon = technicalNameIconMap[skill.icon];
  return (
    <Section centered blurless snug>
      <SectionTitle message={skill.name} variant='h5' />
      <SectionDividerHor />
      <ButtonIcon size={isMobile ? '40%' : '20%'} />
      <Box sx={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row' }}>
        <Section centered blurless>
          <SectionTitle message={'Experience'} variant='h5' />
          {skill.duration}
        </Section>
        <Section centered blurless>
          <SectionTitle message={'Proficiency'} variant='h5' />
          {skill.confidence}
        </Section>
      </Box>
    </Section>
  );
}

export const getButtonContent: {
  [K in SkillType]: (skill: SkillOf[K], isMobile: boolean) => ReactNode;
} = {
  [SkillType.LANGUAGE]: (skill) => getLanguageButtonContent(skill.name, skill.level),
  [SkillType.TECHNICAL]: (skill, isMobile) =>
    getTechnicalButtonContent(skill.name, skill.icon, isMobile),
  [SkillType.INTEREST]: (skill, isMobile) =>
    getInterestsButtonContent(skill.name, skill.icon, isMobile),
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

const technicalNameIconMap: Record<string, FunctionComponent<{ size?: number | string }>> = {
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
  java: JavaOriginal,
  hibernate: HibernateOriginal,
  spring: SpringOriginal,
  junit: JunitOriginal,
  mysql: MysqlOriginal,
  cpp: CplusplusOriginal,
  qt: QtOriginal,
  csharp: CsharpOriginal,
  unity: UnityOriginal,
  git: GitOriginal,
  github: GithubOriginal,
  gitlab: GitlabOriginal,
  kube: KubernetesOriginal,
  debug: BugReportIconOriginal,
  docs: DescriptionIconOriginal,
  cicd: CallMergeIconOriginal,
  claude: ClaudeOriginal,
};
function getTechnicalButtonContent(name: string, icon: string, isMobile: boolean): ReactNode {
  const ButtonIcon = technicalNameIconMap[icon];
  return (
    <ButtonContentContainer>
      <ButtonIcon size={isMobile ? '50%' : '65%'} />
      <ButtonContentLabel>{name}</ButtonContentLabel>
    </ButtonContentContainer>
  );
}

const interestsNameIconMap: Record<string, SvgIconComponent> = {
  handyman: HandymanIcon,
  esports: SportsEsportsIcon,
  code: CodeIcon,
  keyboard: KeyboardIcon,
  devices: DevicesIcon,
  fitness: FitnessCenterIcon,
};
function getInterestsButtonContent(name: string, icon: string, isMobile: boolean): ReactNode {
  const ButtonIcon = interestsNameIconMap[icon];
  return (
    <ButtonContentContainer>
      {getFormattedIcon(ButtonIcon, isMobile ? '40%' : '55%')}
      <ButtonContentLabel>{name}</ButtonContentLabel>
    </ButtonContentContainer>
  );
}