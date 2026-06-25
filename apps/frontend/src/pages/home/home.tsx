import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useTranslation } from 'react-i18next';
import HomeSection from '@/pages/home/home-section';
import { isMobileOnly } from 'react-device-detect';
import me from '@/assets/me.jpg';
import HomeSectionParagraph, { PLACEHOLDER_TYPE } from '@/pages/home/home-section-paragraph';

const Home = () => {
  const { t } = useTranslation();

  return (
    <Box sx={{ gap: '8px', marginX: '16px', width: 'calc(100vw - 32px)' }}>
      <Box sx={{ display: 'flex', flexDirection: isMobileOnly ? 'column-reverse' : 'row' }}>
        <HomeSection width={isMobileOnly ? undefined : '80%'} title={t('home.intro.title')}>
          <HomeSectionParagraph i18nKey='home.intro.1' />
          <HomeSectionParagraph i18nKey='home.intro.2' />
          <HomeSectionParagraph i18nKey='home.intro.3' />
          <HomeSectionParagraph i18nKey='home.intro.4' />
        </HomeSection>
        <HomeSection width={isMobileOnly ? undefined : '40%'} title={t('home.details.title')}>
          <HomeSectionParagraph
            i18nKey='home.details.name'
            placeholders={[
              { name: 'name', i18nKey: 'common.name', placeholderType: PLACEHOLDER_TYPE.TEXT },
            ]}
          />
          <HomeSectionParagraph
            i18nKey='home.details.gender'
            placeholders={[
              { name: 'gender', i18nKey: 'common.gender', placeholderType: PLACEHOLDER_TYPE.TEXT },
            ]}
          />
          <HomeSectionParagraph
            i18nKey='home.details.email'
            placeholders={[
              { name: 'email', i18nKey: 'common.email', placeholderType: PLACEHOLDER_TYPE.EMAIL },
            ]}
          />
          <HomeSectionParagraph
            i18nKey='home.details.mobile'
            placeholders={[
              { name: 'mobile', i18nKey: 'common.mobile', placeholderType: PLACEHOLDER_TYPE.TEXT },
            ]}
          />
          <HomeSectionParagraph
            i18nKey='home.details.linkedin'
            placeholders={[
              {
                name: 'linkedin',
                i18nKey: 'common.linkedin',
                placeholderType: PLACEHOLDER_TYPE.LINK,
              },
            ]}
          />
          <HomeSectionParagraph
            i18nKey='home.details.github'
            placeholders={[
              { name: 'github', i18nKey: 'common.github', placeholderType: PLACEHOLDER_TYPE.LINK },
            ]}
          />
        </HomeSection>
        <HomeSection style={{ justifyContent: 'center' }}>
          <Box component='img' src={me} sx={{ height: 'auto', width: '100%' }} />
        </HomeSection>
      </Box>
      <HomeSection title={t('home.project.title')}>
        <Typography variant={'body1'} sx={{ textAlign: 'justify' }}>
          <HomeSectionParagraph i18nKey='home.project.1' />
          <HomeSectionParagraph i18nKey='home.project.2' />
          <HomeSectionParagraph i18nKey='home.project.3' />
        </Typography>
      </HomeSection>
    </Box>
  );
};

export default Home;