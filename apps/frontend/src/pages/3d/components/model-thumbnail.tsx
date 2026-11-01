import useIsMobile from '@/common/hooks/use-is-mobile';
import useSpacing from '@/common/hooks/use-spacing';
import { type Model, thumbnailUrl } from '@/pages/3d/utils/models';
import ViewInAr from '@mui/icons-material/ViewInAr';
import Box from '@mui/material/Box';
import { useState } from 'react';

type ModelThumbnailProps = { model: Model };

const ModelThumbnail = ({ model }: ModelThumbnailProps) => {
  const isMobile = useIsMobile();
  const { padding } = useSpacing();
  const [failed, setFailed] = useState(false);
  const size = isMobile ? 36 : 48;

  return (
    <Box
      sx={{
        width: size,
        height: size,
        borderRadius: `${padding / 2}px`,
        flexShrink: 0,
        mr: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        bgcolor: 'action.hover',
      }}
    >
      {model.thumbnail && !failed ? (
        <Box
          component='img'
          src={thumbnailUrl(model.id)}
          alt=''
          loading='lazy'
          onError={() => setFailed(true)}
          sx={{ width: '100%', height: '100%', objectFit: 'contain' }}
        />
      ) : (
        <ViewInAr fontSize='small' sx={{ color: 'text.secondary' }} />
      )}
    </Box>
  );
};

export default ModelThumbnail;
