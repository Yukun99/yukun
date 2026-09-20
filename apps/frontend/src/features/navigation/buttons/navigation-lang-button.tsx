import RoundIconButton from '@/common/components/buttons/round-icon-button';
import useLanguageToggle from '@/features/navigation/use-language-toggle';
import Public from '@mui/icons-material/Public';

const NavigationLanguageButton = () => {
  const { label, toggle } = useLanguageToggle();
  return <RoundIconButton onClick={toggle} icon={Public} label={label} />;
};

export default NavigationLanguageButton;
