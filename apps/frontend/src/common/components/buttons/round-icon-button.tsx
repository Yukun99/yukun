import { type MouseEvent, useRef } from 'react';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import { SvgIconComponent } from '@mui/icons-material';
import { isMobileOnly } from 'react-device-detect';
import Typography from '@mui/material/Typography';
import StarBurst, { type StarBurstHandle } from '@/common/components/effects/star-burst';

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

  function getFormattedIcon(Icon: SvgIconComponent | string) {
    if (typeof Icon === 'string') {
      return (
        <Box
          component='img'
          src={Icon}
          alt={label}
          sx={{ width: size * 0.6, height: size * 0.6 }}
        />
      );
    }
    return <Icon sx={{ fontSize: size * 0.6 }} />;
  }

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
      {getFormattedIcon(Icon)}
      {label && (
        <Typography sx={{ fontSize: size * 0.2 }} variant='button'>
          {label}
        </Typography>
      )}
    </Button>
  );
};

export default RoundIconButton;