import Typography from '@mui/material/Typography';
import { ReactNode } from 'react';

export type SectionParagraphProps = { children: ReactNode; textAlign?: string; style?: any };

const SectionParagraph = ({ children, textAlign, style }: SectionParagraphProps) => {
  return (
    <Typography variant={'body1'} sx={{ textAlign: textAlign, marginBottom: '16px', ...style }}>
      {children}
    </Typography>
  );
};

export default SectionParagraph;