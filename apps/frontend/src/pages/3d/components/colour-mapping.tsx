import Section from '@/common/components/sections/section';
import useIsMobile from '@/common/hooks/use-is-mobile';
import useResolvedMode from '@/common/hooks/use-resolved-mode';
import useSpacing from '@/common/hooks/use-spacing';
import { getInvertedPageElementBgColor, GRAY } from '@/common/utils/palette';
import ColourPicker from '@/pages/3d/components/colour-picker';
import Swatch from '@/pages/3d/components/swatch';
import useColourMapping from '@/pages/3d/use-colour-mapping';
import { hexToRgba, type Rgba, rgbaToHex } from '@/pages/3d/utils/colour';
import { API, parseModels } from '@/pages/3d/utils/models';
import { PAGE } from '@/pages/3d/utils/page';
import { recolourInWorker } from '@/pages/3d/utils/recolour';
import ArrowRightAlt from '@mui/icons-material/ArrowRightAlt';
import Download from '@mui/icons-material/Download';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { Object3D } from 'three';

type ColourMappingProps = {
  plates: Object3D[];
  id?: number;
  updatedAt?: number;
  name: string;
  sourceUrl?: string;
};
type Editing = { hex: string; anchor: HTMLElement; previous: Record<string, Rgba> };

const recolourSource = async (url: string, hexes: Record<string, string>, signal: AbortSignal) => {
  const res = await fetch(url, { signal });
  if (!res.ok) throw new Error('Download failed');
  return recolourInWorker(await res.arrayBuffer(), hexes, signal);
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

const ColourMapping = ({ plates, id, updatedAt, name, sourceUrl }: ColourMappingProps) => {
  const { t } = useTranslation(PAGE);
  const isMobile = useIsMobile();
  const mode = useResolvedMode();
  const { padding } = useSpacing();
  const { colours, mapping, set, replace } = useColourMapping(plates);
  const [editing, setEditing] = useState<Editing | null>(null);
  const [busy, setBusy] = useState(false);
  const [failed, setFailed] = useState(false);
  const abort = useRef<AbortController | null>(null);
  const size = isMobile ? 24 : 28;
  const mappedBorder = getInvertedPageElementBgColor(mode);

  useEffect(() => () => abort.current?.abort(), []);

  const download = async () => {
    if (!sourceUrl) return;
    const controller = new AbortController();
    abort.current = controller;
    setBusy(true);
    setFailed(false);
    try {
      if (id !== undefined && updatedAt !== undefined && (await isStale(id, updatedAt, controller.signal))) {
        window.location.reload();
        return;
      }
      const hexes = Object.fromEntries(Object.entries(mapping).map(([k, v]) => [k, rgbaToHex(v)]));
      const out = await recolourSource(sourceUrl, hexes, controller.signal);
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

  if (!colours.length) return null;

  const overlay = { position: 'absolute', right: padding, pointerEvents: 'auto' } as const;

  return (
    <>
      <Section
        variant='flat'
        noMargin
        noPadding
        sx={{ ...overlay, top: padding, maxHeight: 'calc(50% - 28px)' }}
      >
        <Box
          role='group'
          aria-label={t('colours')}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-end',
            gap: 0.75,
            p: `${padding / 2}px`,
            px: `${padding}px`,
          }}
        >
          {colours.map((hex) => {
            const original = hexToRgba(hex) as Rgba;
            return (
              <Box key={hex} sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Box role='img' aria-label={t('originalColour', { colour: hex })}>
                  <Swatch rgba={original} size={size} border={GRAY[50]} />
                </Box>
                <ArrowRightAlt sx={{ color: 'text.secondary' }} />
                <IconButton
                  aria-label={t('mappedColour', { colour: hex })}
                  sx={{ p: 0 }}
                  onClick={(event) =>
                    setEditing({ hex, anchor: event.currentTarget, previous: mapping })
                  }
                >
                  <Swatch rgba={mapping[hex] ?? original} size={size} border={mappedBorder} />
                </IconButton>
              </Box>
            );
          })}
        </Box>
      </Section>
      {sourceUrl && (
        <Section variant='flat' noMargin noPadding sx={{ ...overlay, bottom: padding }}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              p: `${padding / 2}px`,
            }}
          >
            <IconButton
              aria-label={t('download')}
              disabled={busy}
              onClick={download}
              sx={{ width: size, height: size, p: 0 }}
            >
              {busy ? <CircularProgress size={size - 8} /> : <Download fontSize='small' />}
            </IconButton>
            {failed && (
              <Typography variant='body1' color='error'>
                {t('errors.download')}
              </Typography>
            )}
          </Box>
        </Section>
      )}
      {editing && (
        <ColourPicker
          key={editing.hex}
          anchor={editing.anchor}
          value={mapping[editing.hex] ?? (hexToRgba(editing.hex) as Rgba)}
          others={colours
            .filter((hex) => hex !== editing.hex)
            .map((hex) => ({ hex, rgba: mapping[hex] ?? (hexToRgba(hex) as Rgba) }))}
          onChange={(rgba) => set(editing.hex, rgba)}
          onSwap={set}
          onConfirm={() => setEditing(null)}
          onCancel={() => {
            replace(editing.previous);
            setEditing(null);
          }}
        />
      )}
    </>
  );
};

export default ColourMapping;
