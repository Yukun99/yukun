import RoundIconButton from '@/common/components/buttons/round-icon-button';
import Section from '@/common/components/sections/section';
import SectionDialog from '@/common/components/sections/section-dialog';
import useIsMobile from '@/common/hooks/use-is-mobile';
import useSpacing from '@/common/hooks/use-spacing';
import ModelViewer from '@/pages/3d/components/model-viewer';
import { disposeObject } from '@/pages/3d/utils/dispose';
import { toGlb } from '@/pages/3d/utils/glb';
import { loadThreeMf } from '@/pages/3d/utils/load-three-mf';
import { isValidLink, MAX_NAME, MAX_SIZE } from '@/pages/3d/utils/models';
import { PAGE } from '@/pages/3d/utils/page';
import { renderThumbnail } from '@/pages/3d/utils/thumbnail';
import Check from '@mui/icons-material/Check';
import Close from '@mui/icons-material/Close';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { type ChangeEvent, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { Group } from 'three';

type UploadDialogProps = {
  open: boolean;
  onClose: () => void;
  onUpload: (
    data: ArrayBuffer,
    name: string,
    link: string,
    thumbnail: ArrayBuffer | null,
  ) => Promise<boolean>;
};

type Status = 'idle' | 'parsing' | 'rendering' | 'converting' | 'uploading';
type Failure = 'parse' | 'tooLarge' | 'upload';

const UploadDialog = ({ open, onClose, onUpload }: UploadDialogProps) => {
  const { t } = useTranslation(PAGE);
  const isMobile = useIsMobile();
  const { margin } = useSpacing();
  const [plates, setPlates] = useState<Group[] | null>(null);
  const [plate, setPlate] = useState(0);
  const [fileName, setFileName] = useState('');
  const [name, setName] = useState('');
  const [link, setLink] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const [failure, setFailure] = useState<Failure | null>(null);
  const session = useRef(0);
  const abort = useRef<AbortController | null>(null);

  useEffect(
    () => () => {
      plates?.forEach(disposeObject);
    },
    [plates],
  );

  useEffect(() => {
    if (open) return;
    session.current++;
    abort.current?.abort();
    setPlates(null);
    setPlate(0);
    setFileName('');
    setName('');
    setLink('');
    setStatus('idle');
    setFailure(null);
  }, [open]);

  const busy = status !== 'idle';
  const width = isMobile ? '90vw' : '70vw';
  const height = isMobile ? '85vh' : '70vh';
  const linkValid = isValidLink(link.trim());
  const canConfirm = !!plates && !!name.trim() && linkValid && !busy;
  const message = failure ? t(`errors.${failure}`) : busy ? t(status) : '';

  const handleFile = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    const current = session.current;
    setPlates(null);
    setPlate(0);
    setFailure(null);
    setFileName(file.name);
    setStatus('parsing');
    const controller = new AbortController();
    abort.current = controller;
    try {
      const parsed = await loadThreeMf(await file.arrayBuffer(), controller.signal);
      if (session.current !== current) {
        parsed.forEach(disposeObject);
        return;
      }
      setPlates(parsed);
      setName((value) => value || file.name.replace(/\.[^.]+$/, '').slice(0, MAX_NAME));
    } catch {
      if (session.current !== current) return;
      setFailure('parse');
    }
    setStatus('idle');
  };

  const handleConfirm = async () => {
    if (!plates) return;
    const current = session.current;
    setFailure(null);
    setStatus('rendering');
    let thumbnail: ArrayBuffer | null;
    try {
      thumbnail = await renderThumbnail(plates[Math.min(plate, plates.length - 1)]);
    } catch {
      thumbnail = null;
    }
    if (session.current !== current) return;
    setStatus('converting');
    let glb: ArrayBuffer;
    try {
      glb = await toGlb(plates);
    } catch {
      if (session.current !== current) return;
      setFailure('parse');
      setStatus('idle');
      return;
    }
    if (session.current !== current) return;
    if (glb.byteLength > MAX_SIZE) {
      setFailure('tooLarge');
      setStatus('idle');
      return;
    }
    setStatus('uploading');
    const ok = await onUpload(glb, name.trim(), link.trim(), thumbnail);
    if (session.current !== current) return;
    setStatus('idle');
    if (ok) onClose();
    else setFailure('upload');
  };

  return (
    <SectionDialog
      open={open}
      onClose={onClose}
      paperSx={{ width, height, maxWidth: 'none', margin: 0 }}
    >
      <Section variant='flat' noMargin sx={{ height }}>
        <Box sx={{ display: 'flex', flex: 1, minHeight: 0, gap: `${margin}px` }}>
          <Box sx={{ flex: 1, minHeight: 0, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ flex: 1, minHeight: 0, display: 'flex' }}>
              {plates ? (
                <ModelViewer
                  key={plates[0].uuid}
                  objects={plates}
                  plate={plate}
                  onPlateChange={setPlate}
                />
              ) : (
                <Box
                  sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  <Typography color={failure ? 'error' : 'text.secondary'}>{message}</Typography>
                </Box>
              )}
            </Box>
            {plates && plates.length > 1 && (
              <Typography
                variant='caption'
                color='text.secondary'
                sx={{ textAlign: 'center', pt: 0.5 }}
              >
                {t('thumbnailPlate')}
              </Typography>
            )}
          </Box>
          <Box
            sx={{
              width: isMobile ? 200 : 280,
              display: 'flex',
              flexDirection: 'column',
              gap: `${margin}px`,
            }}
          >
            <Button component='label' variant='outlined' disabled={busy}>
              {t('pickFile')}
              <input type='file' accept='.3mf' hidden onChange={handleFile} />
            </Button>
            {fileName && (
              <Typography variant='caption' noWrap>
                {fileName}
              </Typography>
            )}
            <TextField
              variant='standard'
              label={t('nameLabel')}
              fullWidth
              value={name}
              onChange={(e) => setName(e.target.value)}
              slotProps={{
                htmlInput: { maxLength: MAX_NAME },
                input: {
                  endAdornment: (
                    <InputAdornment position='end'>
                      <Typography
                        variant='caption'
                        color={name.length >= MAX_NAME ? 'error' : 'text.primary'}
                      >
                        {`${name.length}/${MAX_NAME}`}
                      </Typography>
                    </InputAdornment>
                  ),
                },
              }}
            />
            <TextField
              variant='standard'
              label={t('linkLabel')}
              fullWidth
              value={link}
              error={!linkValid}
              helperText={linkValid ? undefined : t('errors.link')}
              onChange={(e) => setLink(e.target.value)}
            />
            {plates && message && (
              <Typography variant='body2' color={failure ? 'error' : 'text.secondary'}>
                {message}
              </Typography>
            )}
            <Box sx={{ flex: 1 }} />
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <RoundIconButton
                icon={Close}
                label={t('cancel')}
                onClick={onClose}
                style={{ marginLeft: 0 }}
              />
              <RoundIconButton
                icon={Check}
                label={t('confirm')}
                onClick={handleConfirm}
                disabled={!canConfirm}
                style={{ marginRight: 0 }}
              />
            </Box>
          </Box>
        </Box>
      </Section>
    </SectionDialog>
  );
};

export default UploadDialog;
