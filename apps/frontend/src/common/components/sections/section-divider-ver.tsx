import Box from '@mui/material/Box';

type SectionDividerVerProps = { slim?: boolean };

const SectionDividerVer = ({ slim }: SectionDividerVerProps) => {
  return (
    <Box
      sx={{
        borderLeft: '1px solid',
        borderColor: 'divider',
        alignSelf: 'stretch',
        flexShrink: 0,
        marginRight: slim ? undefined : '16px',
      }}
    />
  );
};

export default SectionDividerVer;
