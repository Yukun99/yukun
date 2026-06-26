import Box from '@mui/material/Box';

const SectionDividerHor = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        borderBottom: '1px solid',
        borderColor: 'divider',
        marginBottom: '16px',
      }}
    />
  );
};

export default SectionDividerHor;