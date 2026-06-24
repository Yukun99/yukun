import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { Trans, useTranslation } from 'react-i18next';
import HomeSection from '@/pages/home/home-section';
import { isMobileOnly } from 'react-device-detect';
import Link from '@mui/material/Link';

const Home = () => {
  const { t } = useTranslation();
  const email = t('home.project.email');

  return (
    <Box sx={{ gap: '8px', background: 'transparent' }}>
      <HomeSection width={isMobileOnly ? 'calc(100vw - 48px)' : '60vw'}>
        <Typography variant='h3' sx={{ fontWeight: 'bold' }}>
          {t('home.intro.title')}
        </Typography>
        <Typography variant={'body1'} sx={{ textAlign: 'justify' }}>
          {t('home.intro.1')}
          <br />
          <br />
          {t('home.intro.2')}
          <br />
          <br />
          {t('home.intro.3')}
          <br />
          <br />
          {t('home.intro.4')}
        </Typography>
      </HomeSection>
      <HomeSection width='calc(100vw - 48px)'>
        <Typography variant='h3' sx={{ fontWeight: 'bold' }}>
          {t('home.project.title')}
        </Typography>
        <Typography variant={'body1'} sx={{ textAlign: 'justify' }}>
          {t('home.project.1')}
          <br />
          <br />
          {t('home.project.2')}
          <br />
          <br />
          <Trans
            i18nKey='home.project.3'
            values={{ email }}
            components={{ email: <Link href={`mailto:${email}`} /> }}
          />
        </Typography>
      </HomeSection>
    </Box>
  );
};

export default Home;