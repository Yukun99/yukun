import Box from '@mui/material/Box';

type SectionDividerVertProps = { isSolid?: boolean };

const SectionDividerVert = ({ isSolid }: SectionDividerVertProps) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        borderLeft: isSolid ? '1px solid' : undefined,
        borderColor: isSolid ? 'divider' : undefined,
        marginX: '16px',
      }}
    />
  );
};

export default SectionDividerVert;