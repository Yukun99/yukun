import Section from '@/common/components/sections/section';
import SectionParagraphByKey, {
  PLACEHOLDER_TYPE,
} from '@/common/components/sections/section-paragraph-by-key';
import useIsMobile from '@/common/hooks/use-is-mobile';
import { PAGE } from '@/pages/resume/resume';

const ContactSection = () => {
  const isMobile = useIsMobile();

  return (
    <Section page={PAGE} title='contact' width={isMobile ? undefined : '50%'}>
      <SectionParagraphByKey
        page={PAGE}
        i18nKey={'contact.name'}
        textAlign='left'
        placeholders={[
          { name: 'name', i18nKey: 'common.name', placeholderType: PLACEHOLDER_TYPE.TEXT },
        ]}
      />
      <SectionParagraphByKey
        page={PAGE}
        i18nKey={'contact.mobile'}
        textAlign='left'
        placeholders={[
          { name: 'mobile', i18nKey: 'common.mobile', placeholderType: PLACEHOLDER_TYPE.TEXT },
        ]}
      />
      <SectionParagraphByKey
        page={PAGE}
        i18nKey='contact.email'
        textAlign='left'
        placeholders={[
          { name: 'email', i18nKey: 'common.email', placeholderType: PLACEHOLDER_TYPE.EMAIL },
        ]}
      />
      <SectionParagraphByKey
        page={PAGE}
        i18nKey='contact.github'
        textAlign='left'
        placeholders={[
          { name: 'github', i18nKey: 'common.github', placeholderType: PLACEHOLDER_TYPE.LINK },
        ]}
      />
      <SectionParagraphByKey
        page={PAGE}
        i18nKey='contact.website'
        textAlign='left'
        placeholders={[
          { name: 'website', i18nKey: 'common.website', placeholderType: PLACEHOLDER_TYPE.LINK },
        ]}
      />
      <SectionParagraphByKey
        page={PAGE}
        i18nKey='contact.linkedin'
        textAlign='left'
        placeholders={[
          { name: 'linkedin', i18nKey: 'common.linkedin', placeholderType: PLACEHOLDER_TYPE.LINK },
        ]}
      />
    </Section>
  );
};

export default ContactSection;
