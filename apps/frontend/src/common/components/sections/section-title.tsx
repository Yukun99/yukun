import { TypographyVariant } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import { useTranslation } from 'react-i18next';

type SectionTitleProps = {
  page?: string;
  title?: string;
  message?: string;
  underline?: boolean;
  variant?: TypographyVariant;
};

const SectionTitle = ({ page, title, message, underline, variant = 'h4' }: SectionTitleProps) => {
  const { t } = useTranslation(page);
  return (
    <Typography
      variant={variant}
      sx={{
        fontWeight: '500',
        letterSpacing: '0.05em',
        marginBottom: underline ? '16px' : undefined,
        borderBottom: underline ? '1px solid' : undefined,
        borderColor: underline ? 'divider' : undefined,
      }}
    >
      {page && title && t(`${title}.title`)}
      {message && message}
    </Typography>
  );
};

export default SectionTitle;
