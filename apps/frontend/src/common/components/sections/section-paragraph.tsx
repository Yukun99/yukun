import Typography from '@mui/material/Typography';
import { ReactNode } from 'react';
import { GLOBAL_MARGIN } from '@/pages/page';

export type SectionParagraphProps = {
  children: ReactNode;
  textAlign?: string;
  noGap?: boolean;
  style?: any;
};

const SectionParagraph = ({ children, textAlign, noGap, style }: SectionParagraphProps) => {
  return (
    <Typography
      variant={'body1'}
      sx={{
        textAlign: textAlign,
        marginBottom: noGap ? undefined : `${GLOBAL_MARGIN}px`,
        ...style,
      }}
    >
      {children}
    </Typography>
  );
};

export default SectionParagraph;