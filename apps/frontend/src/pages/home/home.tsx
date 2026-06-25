import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { Trans, useTranslation } from 'react-i18next';
import HomeSection from '@/pages/home/home-section';
import { isMobileOnly } from 'react-device-detect';
import Link from '@mui/material/Link';
import me from '@/assets/me.jpg';

const Home = () => {
  const { t } = useTranslation();
  const email = t('common.email');
  const linkedin = t('common.linkedin');

  return (
    <Box sx={{ gap: '8px', marginX: '16px', width: 'calc(100vw - 32px)' }}>
      <Box sx={{ display: 'flex', flexDirection: isMobileOnly ? 'column-reverse' : 'row' }}>
        <HomeSection>
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
        <HomeSection>
          <Box sx={{ width: '25vw' }}>
            <Typography variant='h3' sx={{ fontWeight: 'bold' }}>
              {t('home.details.title')}
            </Typography>
            {t('home.details.name', { name: t('common.name') })}
            <br />
            <br />
            {t('home.details.gender', { gender: t('common.gender') })}
            <br />
            <br />
            <Trans
              i18nKey='home.details.email'
              values={{ email }}
              components={{ email: <Link href={`mailto:${email}`} /> }}
            />
            <br />
            <br />
            {t('home.details.mobile', { mobile: t('common.mobile') })}
            <br />
            <br />
            <Trans
              i18nKey='home.details.linkedin'
              values={{ linkedin }}
              components={{
                linkedin: <Link href={linkedin} target='_blank' rel='noopener noreferrer' />,
              }}
            />
          </Box>
        </HomeSection>
        <HomeSection style={{ justifyContent: 'center' }}>
          <Box component='img' src={me} sx={{ width: '15vw', height: 'auto' }} />
        </HomeSection>
      </Box>
      <HomeSection>
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
          {t('home.project.3')}
        </Typography>
      </HomeSection>
    </Box>
  );
};

export default Home;