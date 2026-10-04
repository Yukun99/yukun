import me from '@/assets/home/me.jpg';
import Section from '@/common/components/sections/section';
import SectionParagraphByKey, {
  PLACEHOLDER_TYPE,
} from '@/common/components/sections/section-paragraph-by-key';
import useIsMobile from '@/common/hooks/use-is-mobile';
import { PAGE } from '@/pages/home/utils/page';
import Page from '@/pages/page';
import Box from '@mui/material/Box';

const DETAILS = [
  { key: 'name', type: PLACEHOLDER_TYPE.TEXT },
  { key: 'gender', type: PLACEHOLDER_TYPE.TEXT },
  { key: 'email', type: PLACEHOLDER_TYPE.EMAIL },
  { key: 'mobile', type: PLACEHOLDER_TYPE.TEXT },
  { key: 'linkedin', type: PLACEHOLDER_TYPE.LINK },
  { key: 'github', type: PLACEHOLDER_TYPE.LINK },
];

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
      {DETAILS.map(({ key, type }) => (
        <SectionParagraphByKey
          key={key}
          page={PAGE}
          i18nKey={`details.${key}`}
          textAlign='left'
          placeholders={[{ name: key, i18nKey: `common.${key}`, placeholderType: type }]}
        />
      ))}
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
