import Box from '@mui/material/Box';

const SectionDividerVert = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        // borderLeft: '1px solid',
        // borderColor: 'divider',
        marginX: '16px',
      }}
    />
  );
};

export default SectionDividerVert;