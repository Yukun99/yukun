import RoundIconButton from '@/common/components/buttons/round-icon-button';
import useThemeToggle from '@/features/navigation/use-theme-toggle';

const NavigationThemeButton = () => {
  const { icon, label, toggle } = useThemeToggle();
  return <RoundIconButton onClick={toggle} icon={icon} label={label} />;
};

export default NavigationThemeButton;
