import Section from '@/common/components/sections/section';
import useSpacing from '@/common/hooks/use-spacing';
import { type Rgba, rgbaToHex } from '@/pages/3d/utils/colour';
import { API, parseModels } from '@/pages/3d/utils/models';
import { PAGE } from '@/pages/3d/utils/page';
import { recolourInWorker } from '@/pages/3d/utils/recolour';
import Delete from '@mui/icons-material/Delete';
import Download from '@mui/icons-material/Download';
import Refresh from '@mui/icons-material/Refresh';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

type ModelActionsProps = {
  size: number;
  mapping: Record<string, Rgba>;
  removed: ReadonlySet<number>;
  empty?: boolean;
  name: string;
  id?: number;
  updatedAt?: number;
  sourceUrl?: string;
  onReload?: () => void;
  onDelete?: () => void;
};

const recolourSource = async (
  url: string,
  hexes: Record<string, string>,
  removed: number[],
  signal: AbortSignal,
) => {
  const res = await fetch(url, { signal });
  if (!res.ok) throw new Error('Download failed');
  return recolourInWorker(await res.arrayBuffer(), hexes, removed, signal);
};

const isStale = async (id: number, updatedAt: number, signal: AbortSignal) => {
  try {
    const res = await fetch(API, { signal });
    const models = res.ok ? parseModels(await res.json()) : null;
    const latest = models?.find((model) => model.id === id);
    return !!latest && latest.updatedAt !== updatedAt;
  } catch {
    return false;
  }
};

const ModelActions = ({
  size,
  mapping,
  removed,
  empty,
  name,
  id,
  updatedAt,
  sourceUrl,
  onReload,
  onDelete,
}: ModelActionsProps) => {
  const { t } = useTranslation(PAGE);
  const { padding } = useSpacing();
  const [busy, setBusy] = useState(false);
  const [failed, setFailed] = useState(false);
  const abort = useRef<AbortController | null>(null);
  const button = { width: size, height: size, p: 0 };

  useEffect(() => () => abort.current?.abort(), []);

  const download = async () => {
    if (!sourceUrl) return;
    const controller = new AbortController();
    abort.current = controller;
    setBusy(true);
    setFailed(false);
    try {
      if (
        id !== undefined
        && updatedAt !== undefined
        && (await isStale(id, updatedAt, controller.signal))
      ) {
        window.location.reload();
        return;
      }
      const hexes = Object.fromEntries(Object.entries(mapping).map(([k, v]) => [k, rgbaToHex(v)]));
      const out = await recolourSource(sourceUrl, hexes, [...removed], controller.signal);
      const url = URL.createObjectURL(new Blob([out], { type: 'model/3mf' }));
      const link = document.createElement('a');
      link.href = url;
      link.download = `${name}.3mf`;
      link.click();
      setTimeout(() => URL.revokeObjectURL(url));
    } catch {
      if (!controller.signal.aborted) setFailed(true);
    }
    if (!controller.signal.aborted) setBusy(false);
  };

  if (!sourceUrl && !onReload && !onDelete) return null;

  return (
    <Section
      variant='flat'
      noMargin
      noPadding
      sx={{ position: 'absolute', right: padding, bottom: padding, pointerEvents: 'auto' }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          p: `${padding / 2}px`,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          {onDelete && (
            <IconButton aria-label={t('deleteObjects')} onClick={onDelete} sx={button}>
              <Delete fontSize='small' />
            </IconButton>
          )}
          {onReload && (
            <IconButton aria-label={t('reload')} onClick={onReload} sx={button}>
              <Refresh fontSize='small' />
            </IconButton>
          )}
          {sourceUrl && (
            <IconButton
              aria-label={t('download')}
              disabled={busy || empty}
              onClick={download}
              sx={button}
            >
              {busy ? <CircularProgress size={size - 8} /> : <Download fontSize='small' />}
            </IconButton>
          )}
        </Box>
        {failed && (
          <Typography variant='body1' color='error'>
            {t('errors.download')}
          </Typography>
        )}
      </Box>
    </Section>
  );
};

export default ModelActions;
