import Claude from '@/assets/resume/Claude.svg';
import IbmRtc from '@/assets/resume/IBM RTC.png';
import ModuleFederation from '@/assets/resume/ModuleFederation.png';
import Nx from '@/assets/resume/Nx.svg';
import Rspack from '@/assets/resume/Rspack.svg';
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
import { FunctionComponent } from 'react';
import ReactCountryFlag from 'react-country-flag';

export type SkillIcon = FunctionComponent<{ size?: number | string }>;

const imageIcon = (src: string, alt: string): SkillIcon => {
  return ({ size }) => (
    <img src={src} style={{ width: size, height: size, objectFit: 'contain' }} alt={alt} />
  );
};

const muiIcon = (Icon: SvgIconComponent, transform?: string): SkillIcon => {
  return ({ size }) => <Icon style={{ width: size, height: size, transform }} />;
};

const EnglishFlag: SkillIcon = ({ size }) => (
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

const ChineseFlag: SkillIcon = ({ size }) => (
  <ReactCountryFlag
    countryCode='CN'
    svg
    style={{ width: size, height: 'auto', objectFit: 'contain' }}
  />
);

export const languageIcons: Record<string, SkillIcon> = { EN: EnglishFlag, CN: ChineseFlag };

export const technicalIcons: Record<string, SkillIcon> = {
  react: ReactOriginal,
  router: ReactrouterOriginal,
  redux: ReduxOriginal,
  rspack: imageIcon(Rspack, 'Rspack'),
  nx: imageIcon(Nx, 'Nx'),
  webpack: WebpackOriginal,
  moduleFederation: imageIcon(ModuleFederation, 'MF'),
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
  debug: muiIcon(BugReportIcon),
  docs: muiIcon(DescriptionIcon),
  cicd: muiIcon(CallMergeIcon, 'rotate(90deg)'),
  claude: imageIcon(Claude, 'Claude'),
  rtc: imageIcon(IbmRtc, 'IBM RTC'),
};

export const interestIcons: Record<string, SvgIconComponent> = {
  handyman: HandymanIcon,
  esports: SportsEsportsIcon,
  code: CodeIcon,
  keyboard: KeyboardIcon,
  devices: DevicesIcon,
  fitness: FitnessCenterIcon,
};