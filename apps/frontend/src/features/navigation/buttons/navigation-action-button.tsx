import { getFormattedIcon } from '@/common/components/buttons/round-icon-button';
import StarBurst, { type StarBurstHandle } from '@/common/components/effects/star-burst';
import { useSpacing } from '@/pages/page';
import { SvgIconComponent } from '@mui/icons-material';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { type MouseEvent, useRef } from 'react';

type NavigationActionButtonProps = {
  icon: SvgIconComponent | string;
  label: string;
  onClick?: () => void;
  isSpecial?: boolean;
};

const NavigationActionButton = ({
  icon,
  label,
  onClick,
  isSpecial,
}: NavigationActionButtonProps) => {
  const { smallRadius } = useSpacing();
  const starBurst = useRef<StarBurstHandle>(null);

  const handleClick = (e: MouseEvent<HTMLElement>) => {
    if (isSpecial) starBurst.current?.burst(e);
    onClick?.();
  };

  return (
    <Button
      onClick={handleClick}
      disableRipple={!onClick && !isSpecial}
      sx={{
        position: 'relative',
        overflow: 'visible',
        flexShrink: 0,
        minWidth: 0,
        gap: '6px',
        padding: '6px 10px',
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: `${smallRadius}px`,
        cursor: onClick || isSpecial ? 'pointer' : 'default',
      }}
    >
      {isSpecial && <StarBurst ref={starBurst} size={28} />}
      {getFormattedIcon(icon, 28, false, 1)}
      <Typography
        variant='button'
        sx={{
          color: 'text.primary',
          textTransform: 'none',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}
      >
        {label}
      </Typography>
    </Button>
  );
};

export default NavigationActionButton;
