import type { Rgba } from '@/pages/3d/utils/colour';
import Box from '@mui/material/Box';

type SwatchProps = { rgba: Rgba; size: number; border: string };

const CHECKER = 'conic-gradient(#ccc 25%, #fff 0 50%, #ccc 0 75%, #fff 0) 0 0 / 8px 8px';

const Swatch = ({ rgba, size, border }: SwatchProps) => {
  const colour = `rgba(${rgba.r}, ${rgba.g}, ${rgba.b}, ${rgba.a / 255})`;
  return (
    <Box
      sx={{
        width: size,
        height: size,
        borderRadius: '50%',
        border: `1px solid ${border}`,
        boxSizing: 'border-box',
        flexShrink: 0,
        background: `linear-gradient(${colour}, ${colour}), ${CHECKER}`,
      }}
    />
  );
};

export default Swatch;
