import Box from '@mui/material/Box';

const SectionDivider = () => {
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

export default SectionDivider;