import { type MouseEvent, useRef } from 'react';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import { SvgIconComponent } from '@mui/icons-material';
import { isMobileOnly } from 'react-device-detect';
import Typography from '@mui/material/Typography';
import StarBurst, { type StarBurstHandle } from '@/common/components/effects/star-burst';
import { PURPLE } from '@/app/palette';

const ICON_GRADIENT_ID = 'round-icon-button-purple-gradient';

export function getFormattedIcon(Icon: SvgIconComponent | string, size: number) {
  if (typeof Icon === 'string') {
    return <Box component='img' src={Icon} sx={{ width: size * 0.6, height: size * 0.6 }} />;
  }
  return (
    <>
      <svg width={0} height={0} style={{ position: 'absolute' }}>
        <linearGradient id={ICON_GRADIENT_ID} x1={0} y1={0} x2={1} y2={1}>
          <stop offset={0} stopColor={PURPLE[0]} />
          <stop offset={1} stopColor={PURPLE[4]} />
        </linearGradient>
      </svg>
      <Icon sx={{ fontSize: size * 0.6, fill: `url(#${ICON_GRADIENT_ID})` }} />
    </>
  );
}

export const BUTTON_SIZE: number = 60;
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
        minWidth: size,
        minHeight: size,
        borderRadius: size,
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
        <Typography sx={{ fontSize: size * 0.2, color: PURPLE[0] }} variant='button'>
          {label}
        </Typography>
      )}
    </Button>
  );
};

export default RoundIconButton;