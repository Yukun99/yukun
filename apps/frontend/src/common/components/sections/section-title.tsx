import Typography from '@mui/material/Typography';
import { useTranslation } from 'react-i18next';

type SectionTitleProps = { page: string; title: string };

const SectionTitle = ({ page, title }: SectionTitleProps) => {
  const { t } = useTranslation(page);
  return (
    <Typography
      variant='h4'
      sx={{
        fontWeight: '500',
        letterSpacing: '0.05em',
        marginBottom: '16px',
        borderBottom: '1px solid',
        borderColor: 'divider',
      }}
    >
      {t(`${title}.title`)}
    </Typography>
  );
};

export default SectionTitle;