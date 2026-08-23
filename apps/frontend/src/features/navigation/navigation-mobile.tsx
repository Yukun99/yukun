import RoundIconButton, { BUTTON_SIZE } from '@/common/components/buttons/round-icon-button';
import { getPageElementBgColor } from '@/features/navigation/navigation';
import NavigationDrawerMobile from '@/features/navigation/navigation-drawer-mobile';
import MenuIcon from '@mui/icons-material/Menu';
import Box from '@mui/material/Box';
import { useColorScheme } from '@mui/material/styles';
import { RefObject, useState } from 'react';

const SIZE = BUTTON_SIZE * 0.8;

type NavigationMobileProps = { contained?: boolean; containerRef?: RefObject<HTMLElement | null> };

const NavigationMobile = ({ contained, containerRef }: NavigationMobileProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { mode } = useColorScheme();

  return (
    <>
      {!isOpen && (
        <Box
          sx={{
            position: contained ? 'absolute' : 'fixed',
            left: '12px',
            bottom: '12px',
            zIndex: (theme) => theme.zIndex.drawer + 1,
            display: 'flex',
            width: `${SIZE}px`,
            height: `${SIZE}px`,
            borderRadius: '50%',
            border: '1px solid',
            borderColor: 'divider',
            overflow: 'hidden',
            boxShadow: (theme) => theme.shadows[16],
            backgroundColor: getPageElementBgColor(mode),
          }}
        >
          <RoundIconButton
            icon={MenuIcon}
            size={SIZE}
            iconScale={0.62}
            onClick={() => setIsOpen(true)}
            style={{ margin: 0 }}
          />
        </Box>
      )}
      <NavigationDrawerMobile
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        contained={contained}
        containerRef={containerRef}
      />
    </>
  );
};

export default NavigationMobile;
