import Section from '@/common/components/sections/section';
import useIsMobile from '@/common/hooks/use-is-mobile';
import useResolvedMode from '@/common/hooks/use-resolved-mode';
import useSpacing from '@/common/hooks/use-spacing';
import { getInvertedPageElementBgColor, GRAY } from '@/common/utils/palette';
import ColourPicker from '@/pages/3d/components/colour-picker';
import ModelActions from '@/pages/3d/components/model-actions';
import Swatch from '@/pages/3d/components/swatch';
import useColourMapping from '@/pages/3d/use-colour-mapping';
import { hexToRgba, type Rgba } from '@/pages/3d/utils/colour';
import { PAGE } from '@/pages/3d/utils/page';
import ArrowRightAlt from '@mui/icons-material/ArrowRightAlt';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { Object3D } from 'three';

type ColourMappingProps = {
  plates: Object3D[];
  id?: number;
  updatedAt?: number;
  name: string;
  sourceUrl?: string;
  noSwap?: boolean;
  removed?: ReadonlySet<number>;
  empty?: boolean;
  onReload?: () => void;
  onDelete?: () => void;
};
type Editing = { hex: string; anchor: HTMLElement; previous: Record<string, Rgba> };

const NONE: ReadonlySet<number> = new Set();

const ColourMapping = ({
  plates,
  id,
  updatedAt,
  name,
  sourceUrl,
  noSwap,
  removed = NONE,
  empty,
  onReload,
  onDelete,
}: ColourMappingProps) => {
  const { t } = useTranslation(PAGE);
  const isMobile = useIsMobile();
  const mode = useResolvedMode();
  const { padding } = useSpacing();
  const { colours, mapping, set, replace } = useColourMapping(plates, removed);
  const [editing, setEditing] = useState<Editing | null>(null);
  const size = isMobile ? 24 : 28;
  const mappedBorder = getInvertedPageElementBgColor(mode);

  const overlay = { position: 'absolute', right: padding, pointerEvents: 'auto' } as const;

  return (
    <>
      {colours.length > 0 && (
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
      )}
      <ModelActions
        size={size}
        mapping={mapping}
        removed={removed}
        empty={empty}
        name={name}
        id={id}
        updatedAt={updatedAt}
        sourceUrl={sourceUrl}
        onReload={onReload}
        onDelete={onDelete}
      />
      {editing && (
        <ColourPicker
          key={editing.hex}
          anchor={editing.anchor}
          value={mapping[editing.hex] ?? (hexToRgba(editing.hex) as Rgba)}
          others={
            noSwap
              ? []
              : colours
                  .filter((hex) => hex !== editing.hex)
                  .map((hex) => ({ hex, rgba: mapping[hex] ?? (hexToRgba(hex) as Rgba) }))
          }
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
