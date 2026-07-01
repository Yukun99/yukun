import RoundIconButton from '@/common/components/buttons/round-icon-button';
import { Public } from '@mui/icons-material';
import type { i18n } from 'i18next';
import { useTranslation } from 'react-i18next';

function getLanguageLabel(i18n: i18n) {
  return i18n.language.startsWith('zh') ? '中文' : 'English';
}

function toggleLanguage(i18n: i18n) {
  i18n.changeLanguage(i18n.language.startsWith('zh') ? 'en' : 'zh');
}

const NavigationLanguageButton = () => {
  const { i18n } = useTranslation();
  return (
    <RoundIconButton
      onClick={() => toggleLanguage(i18n)}
      icon={Public}
      label={getLanguageLabel(i18n)}
    />
  );
};

export default NavigationLanguageButton;
