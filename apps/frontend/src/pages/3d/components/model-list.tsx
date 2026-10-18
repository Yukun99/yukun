import { getFormattedIcon } from '@/common/components/buttons/round-icon-button';
import { FROSTED_BG } from '@/common/components/sections/section';
import useIsMobile from '@/common/hooks/use-is-mobile';
import useSpacing from '@/common/hooks/use-spacing';
import { PURPLE } from '@/common/utils/palette';
import { type Model } from '@/pages/3d/utils/models';
import { PAGE } from '@/pages/3d/utils/page';
import DeleteOutlined from '@mui/icons-material/DeleteOutlined';
import OpenInNew from '@mui/icons-material/OpenInNew';
import Upload from '@mui/icons-material/Upload';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import { useTranslation } from 'react-i18next';

type ModelListProps = {
  models: Model[];
  selected: number | null;
  onSelect: (id: number) => void;
  editable: boolean;
  onUpload: () => void;
  onDelete: (model: Model) => void;
};

const ModelList = ({ models, selected, onSelect, editable, onUpload, onDelete }: ModelListProps) => {
  const { t } = useTranslation(PAGE);
  const isMobile = useIsMobile();
  const { padding } = useSpacing();

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}>
      <Box sx={{ flex: 1, minHeight: 0 }}>
        {models.length === 0 && <Typography variant='body2'>{t('empty')}</Typography>}
        <List disablePadding>
          {models.map((model) => (
            <ListItemButton
              key={model.id}
              selected={model.id === selected}
              onClick={() => onSelect(model.id)}
              sx={{ borderRadius: `${padding / 2}px` }}
            >
              <ListItemText
                primary={model.name}
                slotProps={{ primary: { noWrap: true, variant: 'body2' } }}
              />
              {model.link && (
                <IconButton
                  size='small'
                  component='a'
                  href={model.link}
                  target='_blank'
                  rel='noopener noreferrer'
                  aria-label={t('viewOnMakerWorld')}
                  onClick={(e) => e.stopPropagation()}
                >
                  <OpenInNew fontSize='small' />
                </IconButton>
              )}
              {editable && (
                <IconButton
                  size='small'
                  aria-label={t('delete')}
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(model);
                  }}
                >
                  <DeleteOutlined fontSize='small' />
                </IconButton>
              )}
            </ListItemButton>
          ))}
        </List>
      </Box>
      {editable && (
        <Button
          fullWidth
          variant='text'
          onClick={onUpload}
          sx={{
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: `${padding}px`,
            boxShadow: (theme) => theme.shadows[16],
            background: FROSTED_BG,
            minHeight: isMobile ? 48 : 64,
            gap: 1,
            flexShrink: 0,
          }}
        >
          {getFormattedIcon(Upload, 40, false, 1)}
          <Typography variant='button' sx={{ color: PURPLE[0] }}>
            {t('upload')}
          </Typography>
        </Button>
      )}
    </Box>
  );
};

export default ModelList;
