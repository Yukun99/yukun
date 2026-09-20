import { useTranslation } from 'react-i18next';

const useLanguageToggle = () => {
  const { i18n } = useTranslation();
  const isChinese = i18n.language.startsWith('zh');

  return {
    label: isChinese ? '中文' : 'English',
    toggle: () => i18n.changeLanguage(isChinese ? 'en' : 'zh'),
  };
};

export default useLanguageToggle;
