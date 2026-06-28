import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { isMobileOnly } from 'react-device-detect';
import me from '@/assets/home/me.jpg';
import SectionParagraphByKey, {
  PLACEHOLDER_TYPE,
} from '@/common/components/sections/section-paragraph-by-key';
import Section from '@/common/components/sections/section';
import Page from '@/pages/page';

const PAGE = 'home';

const Home = () => {
  return (
    <Page>
      <Box sx={{ display: 'flex', flexDirection: isMobileOnly ? 'column-reverse' : 'row' }}>
        <Section title='intro' page={PAGE} width={isMobileOnly ? undefined : '80%'}>
          <SectionParagraphByKey page={PAGE} i18nKey='intro.1' />
          <SectionParagraphByKey page={PAGE} i18nKey='intro.2' />
          <SectionParagraphByKey page={PAGE} i18nKey='intro.3' />
          <SectionParagraphByKey page={PAGE} i18nKey='intro.4' />
        </Section>
        <Section title='details' page={PAGE} width={isMobileOnly ? undefined : '40%'}>
          <SectionParagraphByKey
            page={PAGE}
            i18nKey='details.name'
            textAlign='left'
            placeholders={[
              { name: 'name', i18nKey: 'common.name', placeholderType: PLACEHOLDER_TYPE.TEXT },
            ]}
          />
          <SectionParagraphByKey
            page={PAGE}
            i18nKey='details.gender'
            textAlign='left'
            placeholders={[
              { name: 'gender', i18nKey: 'common.gender', placeholderType: PLACEHOLDER_TYPE.TEXT },
            ]}
          />
          <SectionParagraphByKey
            page={PAGE}
            i18nKey='details.email'
            textAlign='left'
            placeholders={[
              { name: 'email', i18nKey: 'common.email', placeholderType: PLACEHOLDER_TYPE.EMAIL },
            ]}
          />
          <SectionParagraphByKey
            page={PAGE}
            i18nKey='details.mobile'
            textAlign='left'
            placeholders={[
              { name: 'mobile', i18nKey: 'common.mobile', placeholderType: PLACEHOLDER_TYPE.TEXT },
            ]}
          />
          <SectionParagraphByKey
            page={PAGE}
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
          <SectionParagraphByKey
            page={PAGE}
            i18nKey='details.github'
            textAlign='left'
            placeholders={[
              { name: 'github', i18nKey: 'common.github', placeholderType: PLACEHOLDER_TYPE.LINK },
            ]}
          />
        </Section>
        <Section page={PAGE} centered>
          <Box component='img' src={me} sx={{ height: 'auto', width: '100%' }} />
        </Section>
      </Box>
      <Section title='project' page={PAGE}>
        <Typography variant='body1' sx={{ textAlign: 'justify' }}>
          <SectionParagraphByKey page={PAGE} i18nKey='project.1' />
          <SectionParagraphByKey page={PAGE} i18nKey='project.2' />
          <SectionParagraphByKey page={PAGE} i18nKey='project.3' />
        </Typography>
      </Section>
    </Page>
  );
};

export default Home;