import SectionParagraph from '@/common/components/sections/section-paragraph';
import Box from '@mui/material/Box';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

const ABACUS_NAMESPACE = 'yukunxu-portfolio';
const ABACUS_KEY = 'site-views';

function isLocalhost() {
  const host = window.location.hostname;
  return host === 'localhost' || host === '127.0.0.1' || host === '[::1]';
}

const FooterViewCounter = () => {
  const { t } = useTranslation();
  const [views, setViews] = useState<number | null>(null);

  useEffect(() => {
    const endpoint = isLocalhost() ? 'get' : 'hit';
    fetch(`https://abacus.jasoncameron.dev/${endpoint}/${ABACUS_NAMESPACE}/${ABACUS_KEY}`)
      .then((res) => res.json())
      .then((data) => setViews(data.value))
      .catch(() => setViews(null));
  }, []);

  if (!views) return null;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <SectionParagraph noGap>{t('footer.viewAbacus')}</SectionParagraph>
      <SectionParagraph link={t('footer.linkAbacus')} noGap>
        {t('footer.linkAbacus')}
      </SectionParagraph>
      <SectionParagraph noGap style={{ color: 'text.secondary' }}>
        {t('footer.views', { views })}
      </SectionParagraph>
    </Box>
  );
};

export default FooterViewCounter;