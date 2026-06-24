import Button from '@mui/material/Button';
import { SvgIconComponent } from '@mui/icons-material';
import { isMobileOnly } from 'react-device-detect';
import Typography from '@mui/material/Typography';

const BUTTON_SIZE: number = 60;
export type ButtonProps = { onClick: () => void; style?: any; size?: number; label?: string };
type RoundIconButtonProps = ButtonProps & { icon: SvgIconComponent };

const RoundIconButton = ({
  icon: Icon,
  onClick,
  style,
  size = BUTTON_SIZE,
  label,
}: RoundIconButtonProps) => {
  return (
    <Button
      sx={{
        minWidth: size,
        minHeight: size,
        borderRadius: size,
        margin: isMobileOnly ? '6px' : '8px',
        padding: 0,
        flexDirection: 'column',
        ...style,
      }}
      onClick={onClick}
      variant='text'
    >
      <Icon sx={{ fontSize: size * 0.6 }} />
      {label && (
        <Typography sx={{ fontSize: size * 0.2 }} variant='button'>
          {label}
        </Typography>
      )}
    </Button>
  );
};

export default RoundIconButton;