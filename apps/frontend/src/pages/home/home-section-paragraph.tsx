import Typography from '@mui/material/Typography';
import { ReactElement } from 'react';
import Link from '@mui/material/Link';
import { Trans, useTranslation } from 'react-i18next';

export enum PLACEHOLDER_TYPE {
  TEXT,
  LINK,
  EMAIL,
}

type PlaceholderProps = { name: string; i18nKey: string; placeholderType: PLACEHOLDER_TYPE };

type HomeSectionParagraphProps = { i18nKey: string; placeholders?: PlaceholderProps[] };

const HomeSectionParagraph = ({ i18nKey, placeholders }: HomeSectionParagraphProps) => {
  const { t } = useTranslation('home');

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
    <Typography variant={'body1'} sx={{ textAlign: 'justify', marginBottom: '16px' }}>
      {getFormattedContent()}
    </Typography>
  );
};

export default HomeSectionParagraph;