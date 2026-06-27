import Box from '@mui/material/Box';

type SectionDividerHorProps = { slim?: boolean };

const SectionDividerHor = ({ slim }: SectionDividerHorProps) => {
  return (
    <Box
      sx={{
        display: 'flex',
        borderBottom: '1px solid',
        borderColor: 'divider',
        marginBottom: slim ? undefined : '16px',
      }}
    />
  );
};

export default SectionDividerHor;