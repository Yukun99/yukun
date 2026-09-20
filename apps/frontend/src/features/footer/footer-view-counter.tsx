import SectionParagraph from '@/common/components/sections/section-paragraph';
import useVisitors from '@/features/footer/use-visitors';
import { useTranslation } from 'react-i18next';

const FooterViewCounter = () => {
  const { t, i18n } = useTranslation();
  const visitors = useVisitors();

  if (visitors === null || visitors.number === null) return null;

  return (
    <SectionParagraph noGap style={{ color: 'text.secondary' }}>
      {t('footer.views', {
        number: visitors.number.toLocaleString(i18n.language),
        total: visitors.total.toLocaleString(i18n.language),
      })}
    </SectionParagraph>
  );
};

export default FooterViewCounter;
