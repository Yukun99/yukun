import Typography from '@mui/material/Typography';
import { useTranslation } from 'react-i18next';

type HomeSectionTitleProps = { title: string };

const HomeSectionTitle = ({ title }: HomeSectionTitleProps) => {
  const { t } = useTranslation('home');
  return (
    <Typography
      variant='h3'
      sx={{ fontWeight: '500', letterSpacing: '0.05em', marginBottom: '16px' }}
    >
      {t(`${title}.title`)}
    </Typography>
  );
};

export default HomeSectionTitle;