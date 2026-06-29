import Typography from '@mui/material/Typography';
import { ReactNode } from 'react';
import { GLOBAL_MARGIN } from '@/pages/page';

export type SectionParagraphProps = {
  children: ReactNode;
  textAlign?: string;
  noGap?: boolean;
  link?: string;
  style?: any;
};

const SectionParagraph = ({ children, textAlign, noGap, link, style }: SectionParagraphProps) => {
  return (
    <Typography
      variant={'body1'}
      component={link ? 'a' : 'p'}
      href={link || undefined}
      target={link ? '_blank' : undefined}
      rel={link ? 'noopener noreferrer' : undefined}
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