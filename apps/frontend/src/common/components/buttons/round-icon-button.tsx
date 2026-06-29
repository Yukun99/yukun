import { PURPLE } from '@/app/palette';
import StarBurst, { type StarBurstHandle } from '@/common/components/effects/star-burst';
import { SvgIconComponent } from '@mui/icons-material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { type MouseEvent, useRef } from 'react';
import { isMobileOnly } from 'react-device-detect';

const ICON_GRADIENT_ID = 'round-icon-button-purple-gradient';

export function getFormattedIcon(Icon: SvgIconComponent | string, size: number | string) {
  const parsedSize = typeof size === 'number' ? size * 0.5 : size;
  if (typeof Icon === 'string') {
    return <Box component='img' src={Icon} sx={{ width: parsedSize, height: parsedSize }} />;
  }
  return (
    <>
      <svg width={0} height={0} style={{ position: 'absolute' }}>
        <linearGradient id={ICON_GRADIENT_ID} x1={0} y1={0} x2={1} y2={1}>
          <stop offset={0} stopColor={PURPLE[0]} />
          <stop offset={1} stopColor={PURPLE[4]} />
        </linearGradient>
      </svg>
      <Icon sx={{ width: parsedSize, height: parsedSize, fill: `url(#${ICON_GRADIENT_ID})` }} />
    </>
  );
}

export const BUTTON_SIZE: number = 75;
export type ButtonProps = { onClick?: () => void; style?: any; size?: number; label?: string };
type RoundIconButtonProps = ButtonProps & { icon: SvgIconComponent | string; isSpecial?: boolean };

const RoundIconButton = ({
  icon: Icon,
  onClick,
  style,
  size = BUTTON_SIZE,
  label,
  isSpecial,
}: RoundIconButtonProps) => {
  const starBurst = useRef<StarBurstHandle>(null);
  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    if (isSpecial) starBurst.current?.burst(e);
    onClick?.();
  };

  return (
    <Button
      sx={{
        width: size,
        height: size,
        borderRadius: '50%',
        margin: isMobileOnly ? '6px' : '8px',
        padding: 0,
        flexDirection: 'column',
        position: 'relative',
        overflow: 'visible',
        ...style,
      }}
      onClick={handleClick}
      variant='text'
    >
      <StarBurst ref={starBurst} size={size} />
      {getFormattedIcon(Icon, size)}
      {label && (
        <Typography sx={{ fontSize: size * 0.16, color: PURPLE[0] }} variant='button'>
          {label}
        </Typography>
      )}
    </Button>
  );
};

export default RoundIconButton;