import { ReactElement } from 'react';
import Link from '@mui/material/Link';
import { Trans, useTranslation } from 'react-i18next';
import SectionParagraph from '@/common/components/sections/section-paragraph';

export enum PLACEHOLDER_TYPE {
  TEXT,
  LINK,
  EMAIL,
}

type PlaceholderProps = { name: string; i18nKey: string; placeholderType: PLACEHOLDER_TYPE };

type SectionParagraphByKeyProps = {
  page?: string;
  i18nKey: string;
  placeholders?: PlaceholderProps[];
  textAlign?: string;
  noGap?: boolean;
  style?: any;
};

const SectionParagraphByKey = ({
  page = '',
  i18nKey,
  placeholders,
  textAlign = 'justify',
  noGap,
  style,
}: SectionParagraphByKeyProps) => {
  const { t } = useTranslation(page);

  function getFormattedContent(): string | ReactElement {
    if (!placeholders) return t(i18nKey);
    const values: Record<string, string> = {};
    const components: Record<string, ReactElement> = {};
    for (const placeholder of placeholders) {
      const value = t(placeholder.i18nKey);
      // text value replacement
      values[placeholder.name] = value;
      // link tag replacement
      switch (placeholder.placeholderType) {
        case PLACEHOLDER_TYPE.LINK:
          components[placeholder.name] = (
            <Link href={value} target='_blank' rel='noopener noreferrer' />
          );
          break;
        case PLACEHOLDER_TYPE.EMAIL:
          components[placeholder.name] = (
            <Link href={`mailto:${value}`} target='_blank' rel='noopener noreferrer' />
          );
          break;
        default:
          break;
      }
    }
    return <Trans t={t} i18nKey={i18nKey} values={values} components={components} />;
  }

  return (
    <SectionParagraph noGap={noGap} textAlign={textAlign} style={style}>
      {getFormattedContent()}
    </SectionParagraph>
  );
};

export default SectionParagraphByKey;