import useIsMobile from '@/common/hooks/use-is-mobile';
import useLineClamp from '@/pages/ideas/use-line-clamp';
import { type Idea } from '@/pages/ideas/utils/ideas';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useRef } from 'react';

type IdeaTileContentProps = { idea: Idea };

const IdeaTileContent = ({ idea }: IdeaTileContentProps) => {
  const isMobile = useIsMobile();
  const body = useRef<HTMLDivElement>(null);
  const lines = useLineClamp(body);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
        minHeight: 0,
        minWidth: 0,
        width: '100%',
        overflow: 'hidden',
        contain: 'inline-size',
      }}
    >
      <Typography
        variant={isMobile ? 'subtitle1' : 'h6'}
        sx={{
          flexShrink: 0,
          fontWeight: 500,
          letterSpacing: '0.05em',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          borderBottom: '1px solid',
          borderColor: 'divider',
          marginBottom: '8px',
          minHeight: '1.5em',
        }}
      >
        {idea.title}
      </Typography>
      <Box ref={body} sx={{ flex: 1, minHeight: 0, overflow: 'hidden' }}>
        <Typography
          variant={isMobile ? 'body2' : 'body1'}
          sx={{
            display: '-webkit-box',
            WebkitBoxOrient: 'vertical',
            WebkitLineClamp: lines,
            overflow: 'hidden',
            whiteSpace: 'pre-wrap',
            overflowWrap: 'anywhere',
          }}
        >
          {idea.content}
        </Typography>
      </Box>
    </Box>
  );
};

export default IdeaTileContent;
