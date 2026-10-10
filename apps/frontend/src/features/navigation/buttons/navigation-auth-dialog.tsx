import RoundIconButton from '@/common/components/buttons/round-icon-button';
import Section from '@/common/components/sections/section';
import SectionDialog from '@/common/components/sections/section-dialog';
import SectionParagraph from '@/common/components/sections/section-paragraph';
import SectionTitle from '@/common/components/sections/section-title';
import useIsMobile from '@/common/hooks/use-is-mobile';
import Check from '@mui/icons-material/Check';
import Close from '@mui/icons-material/Close';
import Box from '@mui/material/Box';
import { useTranslation } from 'react-i18next';

type NavigationAuthDialogProps = { open: boolean; onConfirm: () => void; onClose: () => void };

const NavigationAuthDialog = ({ open, onConfirm, onClose }: NavigationAuthDialogProps) => {
  const { t } = useTranslation();
  const isMobile = useIsMobile();

  return (
    <SectionDialog
      open={open}
      onClose={onClose}
      paperSx={{ width: isMobile ? '60vw' : 'min(60vw, 520px)' }}
    >
      <Section variant='flat' noMargin centered>
        <SectionTitle
          message={t('auth.dialog.title')}
          variant={isMobile ? 'subtitle1' : 'h5'}
          underline
        />
        <SectionParagraph textAlign='center'>{t('auth.dialog.body')}</SectionParagraph>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
          <RoundIconButton
            icon={Close}
            label={t('auth.dialog.cancel')}
            onClick={onClose}
            style={{ marginLeft: 0 }}
          />
          <RoundIconButton
            icon={Check}
            label={t('auth.dialog.confirm')}
            onClick={onConfirm}
            style={{ marginRight: 0 }}
          />
        </Box>
      </Section>
    </SectionDialog>
  );
};

export default NavigationAuthDialog;
