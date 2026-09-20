import me from '@/assets/home/me.jpg';
import Section from '@/common/components/sections/section';
import SectionParagraphByKey, {
  PLACEHOLDER_TYPE,
} from '@/common/components/sections/section-paragraph-by-key';
import useIsMobile from '@/common/hooks/use-is-mobile';
import { PAGE } from '@/pages/home/utils/page';
import Page from '@/pages/page';
import Box from '@mui/material/Box';

const Home = () => {
  const isMobile = useIsMobile();

  const intro = (
    <Section title='intro' page={PAGE} width={isMobile ? undefined : '80%'}>
      <SectionParagraphByKey page={PAGE} i18nKey='intro.1' />
      <SectionParagraphByKey page={PAGE} i18nKey='intro.2' />
      <SectionParagraphByKey page={PAGE} i18nKey='intro.3' />
      <SectionParagraphByKey page={PAGE} i18nKey='intro.4' />
    </Section>
  );

  const details = (
    <Section title='details' page={PAGE} width={isMobile ? '50%' : '40%'}>
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
          { name: 'linkedin', i18nKey: 'common.linkedin', placeholderType: PLACEHOLDER_TYPE.LINK },
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
  );

  const picture = (
    <Section page={PAGE} centered width={isMobile ? '50%' : undefined}>
      <Box component='img' src={me} sx={{ height: 'auto', width: '100%' }} />
    </Section>
  );

  return (
    <Page>
      {isMobile ? (
        <>
          {intro}
          <Box sx={{ display: 'flex' }}>
            {details}
            {picture}
          </Box>
        </>
      ) : (
        <Box sx={{ display: 'flex' }}>
          {intro}
          {details}
          {picture}
        </Box>
      )}
      <Section title='project' page={PAGE}>
        <SectionParagraphByKey page={PAGE} i18nKey='project.1' textAlign='justify' />
        <SectionParagraphByKey page={PAGE} i18nKey='project.2' textAlign='justify' />
        <SectionParagraphByKey page={PAGE} i18nKey='project.3' textAlign='justify' />
      </Section>
    </Page>
  );
};

export default Home;
