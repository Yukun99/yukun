import RoundIconButton from '@/common/components/buttons/round-icon-button';
import Section from '@/common/components/sections/section';
import SectionDialog from '@/common/components/sections/section-dialog';
import SectionParagraph from '@/common/components/sections/section-paragraph';
import SectionTitle from '@/common/components/sections/section-title';
import useIsMobile from '@/common/hooks/use-is-mobile';
import { type Model } from '@/pages/3d/utils/models';
import { PAGE } from '@/pages/3d/utils/page';
import Close from '@mui/icons-material/Close';
import DeleteOutlined from '@mui/icons-material/DeleteOutlined';
import Box from '@mui/material/Box';
import { useTranslation } from 'react-i18next';

type DeleteDialogProps = { model: Model | null; onConfirm: () => void; onClose: () => void };

const DeleteDialog = ({ model, onConfirm, onClose }: DeleteDialogProps) => {
  const { t } = useTranslation(PAGE);
  const isMobile = useIsMobile();

  return (
    <SectionDialog
      open={model !== null}
      onClose={onClose}
      paperSx={{ width: isMobile ? '60vw' : 'min(60vw, 520px)' }}
    >
      <Section variant='flat' noMargin centered>
        <SectionTitle
          message={t('deleteTitle')}
          variant={isMobile ? 'subtitle1' : 'h5'}
          underline
        />
        <SectionParagraph textAlign='center'>
          {t('deleteBody', { name: model?.name ?? '' })}
        </SectionParagraph>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
          <RoundIconButton
            icon={Close}
            label={t('cancel')}
            onClick={onClose}
            style={{ marginLeft: 0 }}
          />
          <RoundIconButton
            icon={DeleteOutlined}
            label={t('deleteConfirm')}
            onClick={onConfirm}
            style={{ marginRight: 0 }}
          />
        </Box>
      </Section>
    </SectionDialog>
  );
};

export default DeleteDialog;
