import en from '@/locales/en.json';
import catalogEn from '@/locales/pages/catalog-en.json';
import catalogZh from '@/locales/pages/catalog-zh.json';
import homeEn from '@/locales/pages/home-en.json';
import homeZh from '@/locales/pages/home-zh.json';
import resumeEn from '@/locales/pages/resume-en.json';
import resumeZh from '@/locales/pages/resume-zh.json';
import zh from '@/locales/zh.json';
import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en, home: homeEn, resume: resumeEn, catalog: catalogEn },
      zh: { translation: zh, home: homeZh, resume: resumeZh, catalog: catalogZh },
    },
    fallbackLng: 'en',
    fallbackNS: 'translation',
    interpolation: { escapeValue: false },
  });

export default i18n;