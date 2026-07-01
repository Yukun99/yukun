import { useSpacing } from '@/pages/page';
import type { Theme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import type { SystemStyleObject } from '@mui/system';
import { CSSProperties, ReactNode } from 'react';

export type SectionParagraphProps = {
  children: ReactNode;
  textAlign?: CSSProperties['textAlign'];
  noGap?: boolean;
  link?: string;
  style?: SystemStyleObject<Theme>;
};

const SectionParagraph = ({ children, textAlign, noGap, link, style }: SectionParagraphProps) => {
  const { margin } = useSpacing();

  return (
    <Typography
      variant={'body1'}
      component={link ? 'a' : 'p'}
      href={link || undefined}
      target={link ? '_blank' : undefined}
      rel={link ? 'noopener noreferrer' : undefined}
      sx={{ textAlign: textAlign, marginBottom: noGap ? undefined : `${margin}px`, ...style }}
    >
      {children}
    </Typography>
  );
};

export default SectionParagraph;
