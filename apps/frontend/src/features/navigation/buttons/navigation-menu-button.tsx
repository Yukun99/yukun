import RoundIconButton, { ButtonProps } from '@/common/components/buttons/round-icon-button';
import MenuIcon from '@mui/icons-material/Menu';

type NavigationMenuButtonProps = ButtonProps & { isOpen: boolean };

const NavigationMenuButton = ({ isOpen, onClick }: NavigationMenuButtonProps) => {
  return (
    <RoundIconButton
      onClick={onClick}
      icon={MenuIcon}
      style={{
        rotate: isOpen ? '90deg' : '0deg',
        transition: 'rotate 0.2s ease-in-out',
        zIndex: 2000,
      }}
    />
  );
};

export default NavigationMenuButton;
