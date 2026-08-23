import Claude from '@/assets/resume/Claude.svg';
import IbmRtc from '@/assets/resume/IBM RTC.png';
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
import AndroidOriginal from 'devicons-react/icons/AndroidOriginal';
import CobolOriginal from 'devicons-react/icons/CobolOriginal';
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
import { TFunction } from 'i18next';
import { FunctionComponent, ReactNode } from 'react';
import ReactCountryFlag from 'react-country-flag';

const RspackOriginal: FunctionComponent<{ size?: number | string }> = ({ size }) => (
  <img src={Rspack} style={{ width: size, height: size, objectFit: 'contain' }} alt='Rspack' />
);
const NxOriginal: FunctionComponent<{ size?: number | string }> = ({ size }) => (
  <img src={Nx} style={{ width: size, height: size, objectFit: 'contain' }} alt='Nx' />
);
const ModuleFederationOriginal: FunctionComponent<{ size?: number | string }> = ({ size }) => (
  <img
    src={ModuleFederation}
    style={{ width: size, height: size, objectFit: 'contain' }}
    alt='MF'
  />
);
const ClaudeOriginal: FunctionComponent<{ size?: number | string }> = ({ size }) => (
  <img src={Claude} style={{ width: size, height: size, objectFit: 'contain' }} alt='Claude' />
);
const BugReportIconOriginal: FunctionComponent<{ size?: number | string }> = ({ size }) => (
  <BugReportIcon style={{ width: size, height: size, objectFit: 'contain' }} />
);
const DescriptionIconOriginal: FunctionComponent<{ size?: number | string }> = ({ size }) => (
  <DescriptionIcon style={{ width: size, height: size, objectFit: 'contain' }} />
);
const CallMergeIconOriginal: FunctionComponent<{ size?: number | string }> = ({ size }) => (
  <CallMergeIcon style={{ width: size, height: size, transform: 'rotate(90deg)' }} />
);
const IbmRtcOriginal: FunctionComponent<{ size?: number | string }> = ({ size }) => (
  <img src={IbmRtc} style={{ width: size, height: size, objectFit: 'contain' }} alt='IBM RTC' />
);

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

export type DialogContentRenderer = (isMobile: boolean) => ReactNode | undefined;

export const getDialogContent: {
  [K in SkillType]: (skill: SkillOf[K], isMobile: boolean, t: TFunction) => ReactNode | undefined;
} = {
  [SkillType.LANGUAGE]: () => undefined,
  [SkillType.TECHNICAL]: getTechnicalDialogContent,
  [SkillType.INTEREST]: () => undefined,
};

function getTechnicalDialogContent(
  skill: TechnicalSkill,
  isMobile: boolean,
  t: TFunction,
): ReactNode {
  const ButtonIcon = technicalNameIconMap[skill.icon];
  const labelVariant = isMobile ? 'subtitle1' : 'h5';
  const panelStyle = isMobile ? { padding: '8px' } : undefined;

  return (
    <Section centered blurless snug style={isMobile ? { height: '78dvh' } : undefined}>
      <SectionTitle message={skill.name} variant={labelVariant} />
      <SectionDividerHor />
      {/* the icon takes whatever height the labels leave behind */}
      <Box
        sx={{
          display: 'flex',
          flex: isMobile ? 1 : undefined,
          minHeight: 0,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <ButtonIcon size={isMobile ? '100%' : '20%'} />
      </Box>
      <Box sx={{ display: 'flex' }}>
        <Section centered blurless style={panelStyle}>
          <SectionTitle message={t('skills.technical.durationLabel')} variant={labelVariant} />
          <Typography variant={isMobile ? 'body2' : 'body1'}>{skill.duration}</Typography>
        </Section>
        <Section centered blurless style={panelStyle}>
          <SectionTitle message={t('skills.technical.proficiencyLabel')} variant={labelVariant} />
          <Typography variant={isMobile ? 'body2' : 'body1'}>{skill.proficiency}</Typography>
        </Section>
      </Box>
    </Section>
  );
}

export const getButtonContent: {
  [K in SkillType]: (skill: SkillOf[K], isMobile: boolean) => ReactNode;
} = {
  [SkillType.LANGUAGE]: getLanguageButtonContent,
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

const EnglishFlag: FunctionComponent<{ size?: number | string }> = ({ size }) => (
  <Box sx={{ position: 'relative', display: 'inline-block', width: size }}>
    <ReactCountryFlag
      countryCode='US'
      svg
      style={{ display: 'block', width: '100%', height: 'auto', visibility: 'hidden' }}
    />
    <Box sx={{ position: 'absolute', inset: 0, clipPath: 'polygon(0 0, 58% 0, 38% 100%, 0 100%)' }}>
      <ReactCountryFlag
        countryCode='US'
        svg
        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
      />
    </Box>
    <Box
      sx={{
        position: 'absolute',
        inset: 0,
        clipPath: 'polygon(62% 0, 100% 0, 100% 100%, 42% 100%)',
      }}
    >
      <ReactCountryFlag
        countryCode='GB'
        svg
        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
      />
    </Box>
  </Box>
);
const ChineseFlag: FunctionComponent<{ size?: number | string }> = ({ size }) => (
  <ReactCountryFlag
    countryCode='CN'
    svg
    style={{ width: size, height: 'auto', objectFit: 'contain' }}
  />
);

const languageNameIconMap: Record<string, FunctionComponent<{ size?: number | string }>> = {
  EN: EnglishFlag,
  CN: ChineseFlag,
};

function getLanguageButtonContent(skill: SkillOf[SkillType.LANGUAGE]): ReactNode {
  const LanguageIcon = languageNameIconMap[skill.code];
  return (
    <ButtonContentContainer>
      <LanguageIcon size={'75%'} />
      <ButtonContentLabel>
        {skill.name}
        {<br />}
        {skill.level}
      </ButtonContentLabel>
    </ButtonContentContainer>
  );
}

export const technicalNameIconMap: Record<string, FunctionComponent<{ size?: number | string }>> = {
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
  android: AndroidOriginal,
  csharp: CsharpOriginal,
  unity: UnityOriginal,
  cobol: CobolOriginal,
  git: GitOriginal,
  github: GithubOriginal,
  gitlab: GitlabOriginal,
  kube: KubernetesOriginal,
  debug: BugReportIconOriginal,
  docs: DescriptionIconOriginal,
  cicd: CallMergeIconOriginal,
  claude: ClaudeOriginal,
  rtc: IbmRtcOriginal,
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
      {getFormattedIcon(ButtonIcon, isMobile ? '40%' : '55%', false)}
      <ButtonContentLabel>{name}</ButtonContentLabel>
    </ButtonContentContainer>
  );
}
