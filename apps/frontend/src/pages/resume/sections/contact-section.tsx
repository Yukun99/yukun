import Section from '@/common/components/sections/section';
import SectionParagraphByKey, {
  PLACEHOLDER_TYPE,
} from '@/common/components/sections/section-paragraph-by-key';
import { PAGE } from '@/pages/resume/utils/page';
import type { Theme } from '@mui/material/styles';
import type { SystemStyleObject } from '@mui/system';

const CONTACTS = [
  { key: 'name', type: PLACEHOLDER_TYPE.TEXT },
  { key: 'mobile', type: PLACEHOLDER_TYPE.TEXT },
  { key: 'email', type: PLACEHOLDER_TYPE.EMAIL },
  { key: 'github', type: PLACEHOLDER_TYPE.LINK },
  { key: 'website', type: PLACEHOLDER_TYPE.LINK },
  { key: 'linkedin', type: PLACEHOLDER_TYPE.LINK },
];

type ContactSectionProps = { style?: SystemStyleObject<Theme> };

const ContactSection = ({ style }: ContactSectionProps) => {
  return (
    <Section page={PAGE} title='contact' width='50%' sx={style}>
      {CONTACTS.map(({ key, type }) => (
        <SectionParagraphByKey
          key={key}
          page={PAGE}
          i18nKey={`contact.${key}`}
          textAlign='left'
          placeholders={[{ name: key, i18nKey: `common.${key}`, placeholderType: type }]}
        />
      ))}
    </Section>
  );
};

export default ContactSection;
