import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import HomeSection from '@/pages/home/home-section';
import { isMobileOnly } from 'react-device-detect';
import me from '@/assets/me.jpg';
import HomeSectionParagraph, { PLACEHOLDER_TYPE } from '@/pages/home/home-section-paragraph';

const Home = () => {
  return (
    <Box sx={{ gap: '8px', marginX: '16px', width: 'calc(100vw - 32px)' }}>
      <Box sx={{ display: 'flex', flexDirection: isMobileOnly ? 'column-reverse' : 'row' }}>
        <HomeSection width={isMobileOnly ? undefined : '80%'} title='intro'>
          <HomeSectionParagraph i18nKey='intro.1' />
          <HomeSectionParagraph i18nKey='intro.2' />
          <HomeSectionParagraph i18nKey='intro.3' />
          <HomeSectionParagraph i18nKey='intro.4' />
        </HomeSection>
        <HomeSection width={isMobileOnly ? undefined : '40%'} title='details'>
          <HomeSectionParagraph
            i18nKey='details.name'
            textAlign='left'
            placeholders={[
              { name: 'name', i18nKey: 'common.name', placeholderType: PLACEHOLDER_TYPE.TEXT },
            ]}
          />
          <HomeSectionParagraph
            i18nKey='details.gender'
            textAlign='left'
            placeholders={[
              { name: 'gender', i18nKey: 'common.gender', placeholderType: PLACEHOLDER_TYPE.TEXT },
            ]}
          />
          <HomeSectionParagraph
            i18nKey='details.email'
            textAlign='left'
            placeholders={[
              { name: 'email', i18nKey: 'common.email', placeholderType: PLACEHOLDER_TYPE.EMAIL },
            ]}
          />
          <HomeSectionParagraph
            i18nKey='details.mobile'
            textAlign='left'
            placeholders={[
              { name: 'mobile', i18nKey: 'common.mobile', placeholderType: PLACEHOLDER_TYPE.TEXT },
            ]}
          />
          <HomeSectionParagraph
            i18nKey='details.linkedin'
            textAlign='left'
            placeholders={[
              {
                name: 'linkedin',
                i18nKey: 'common.linkedin',
                placeholderType: PLACEHOLDER_TYPE.LINK,
              },
            ]}
          />
          <HomeSectionParagraph
            i18nKey='details.github'
            textAlign='left'
            placeholders={[
              { name: 'github', i18nKey: 'common.github', placeholderType: PLACEHOLDER_TYPE.LINK },
            ]}
          />
        </HomeSection>
        <HomeSection style={{ justifyContent: 'center' }}>
          <Box component='img' src={me} sx={{ height: 'auto', width: '100%' }} />
        </HomeSection>
      </Box>
      <HomeSection title='project'>
        <Typography variant={'body1'} sx={{ textAlign: 'justify' }}>
          <HomeSectionParagraph i18nKey='project.1' />
          <HomeSectionParagraph i18nKey='project.2' />
          <HomeSectionParagraph i18nKey='project.3' />
        </Typography>
      </HomeSection>
    </Box>
  );
};

export default Home;