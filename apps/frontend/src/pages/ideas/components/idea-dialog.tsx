import Section from '@/common/components/sections/section';
import SectionDialog from '@/common/components/sections/section-dialog';
import useIsMobile from '@/common/hooks/use-is-mobile';
import useSpacing from '@/common/hooks/use-spacing';
import SectionTitle from '@/common/components/sections/section-title';
import { type Idea, MAX_CONTENT, MAX_TITLE } from '@/pages/ideas/utils/ideas';
import { PAGE } from '@/pages/ideas/utils/page';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useTranslation } from 'react-i18next';

type IdeaDialogProps = {
  idea: Idea | null;
  editable: boolean;
  onChange: (idea: Idea) => void;
  onClose: () => void;
};

const IdeaDialog = ({ idea, editable, onChange, onClose }: IdeaDialogProps) => {
  const { t } = useTranslation(PAGE);
  const isMobile = useIsMobile();
  const { margin } = useSpacing();

  return (
    <SectionDialog
      open={idea !== null}
      onClose={onClose}
      paperSx={{ width: '60vw', height: '60vh', maxWidth: 'none', margin: 0 }}
    >
      {idea && (
        <Section variant='flat' noMargin sx={{ height: '60vh' }}>
          {!editable && (
            <>
              <SectionTitle message={idea.title} variant={isMobile ? 'subtitle1' : 'h5'} underline />
              <Typography variant={isMobile ? 'body2' : 'body1'} sx={{ whiteSpace: 'pre-wrap' }}>
                {idea.content}
              </Typography>
            </>
          )}
          {editable && (
            <>
              <TextField
                variant='standard'
                label={t('titleLabel')}
                fullWidth
                value={idea.title}
                onChange={(e) => onChange({ ...idea, title: e.target.value })}
                slotProps={{
                  htmlInput: { maxLength: MAX_TITLE },
                  input: {
                    sx: (theme) => ({
                      fontWeight: 500,
                      letterSpacing: '0.05em',
                      fontSize: theme.typography[isMobile ? 'subtitle1' : 'h6'].fontSize,
                    }),
                    endAdornment: (
                      <InputAdornment position='end'>
                        <Typography
                          variant='caption'
                          color={idea.title.length >= MAX_TITLE ? 'error' : 'text.primary'}
                        >
                          {`${idea.title.length}/${MAX_TITLE}`}
                        </Typography>
                      </InputAdornment>
                    ),
                  },
                }}
              />
              <TextField
                variant='standard'
                label={t('contentLabel')}
                multiline
                fullWidth
                value={idea.content}
                onChange={(e) => onChange({ ...idea, content: e.target.value })}
                slotProps={{ htmlInput: { maxLength: MAX_CONTENT } }}
                sx={{ flex: 1, minHeight: 0, marginTop: `${margin}px` }}
              />
            </>
          )}
        </Section>
      )}
    </SectionDialog>
  );
};

export default IdeaDialog;
