import Typography from '@mui/material/Typography';

type HomeSectionTitleProps = { title: string };

const HomeSectionTitle = ({ title }: HomeSectionTitleProps) => {
  return (
    <Typography variant='h3' sx={{ fontWeight: 'bold', marginBottom: '16px' }}>
      {title}
    </Typography>
  );
};

export default HomeSectionTitle;