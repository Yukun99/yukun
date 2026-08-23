import SectionParagraph from '@/common/components/sections/section-paragraph';
import Box from '@mui/material/Box';
import type { Theme } from '@mui/material/styles';
import type { SystemStyleObject } from '@mui/system';
import { useTranslation } from 'react-i18next';

type SectionParagraphListProps = {
  page?: string;
  labelKey?: string;
  i18nKey: string;
  separator?: string;
  style?: SystemStyleObject<Theme>;
};

// keeps each entry whole when the line wraps, instead of breaking mid-entry
const SectionParagraphList = ({
  page = '',
  labelKey,
  i18nKey,
  separator = '/',
  style,
}: SectionParagraphListProps) => {
  const { t } = useTranslation(page);
  const items = t(i18nKey, { returnObjects: true }) as string[];

  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', columnGap: '6px', ...style }}>
      {labelKey && <SectionParagraph noGap>{t(labelKey)}</SectionParagraph>}
      {items.map((item, index) => (
        <SectionParagraph key={item} noGap style={{ whiteSpace: 'nowrap' }}>
          {index < items.length - 1 ? `${item} ${separator}` : item}
        </SectionParagraph>
      ))}
    </Box>
  );
};

export default SectionParagraphList;
