import Scroller from '@/common/components/scroller';
import { FROSTED_BG } from '@/common/components/sections/section';
import SectionDividerVer from '@/common/components/sections/section-divider-ver';
import useIsMobile from '@/common/hooks/use-is-mobile';
import useSpacing from '@/common/hooks/use-spacing';
import { GRAY } from '@/common/utils/palette';
import Swatch from '@/pages/3d/components/swatch';
import { hexToRgba, hsvToRgb, type Rgba, rgbaToHex, rgbToHsv } from '@/pages/3d/utils/colour';
import { PAGE } from '@/pages/3d/utils/page';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Popover from '@mui/material/Popover';
import Slider from '@mui/material/Slider';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import ContentCopy from '@mui/icons-material/ContentCopy';
import Shuffle from '@mui/icons-material/Shuffle';
import { type PointerEvent, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

type ColourPickerProps = {
  anchor: HTMLElement;
  value: Rgba;
  others: { hex: string; rgba: Rgba }[];
  onChange: (rgba: Rgba) => void;
  onSwap: (hex: string, rgba: Rgba) => void;
  onConfirm: () => void;
  onCancel: () => void;
};

const RAINBOW = 'linear-gradient(to right, red, yellow, lime, cyan, blue, magenta, red)';
const THUMB = 14;
const FIELD = { flex: 1, '& .MuiInputBase-input': { px: 1 } };
const NUMBER = {
  ...FIELD,
  '& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button': {
    WebkitAppearance: 'none',
    margin: 0,
  },
  '& input[type=number]': { MozAppearance: 'textfield' },
};

const clamp = (value: number, max = 255) => Math.min(Math.max(Math.round(value) || 0, 0), max);

const CHANNELS = ['r', 'g', 'b'] as const;
const CHANNEL_KEYS = { r: 'red', g: 'green', b: 'blue' } as const;

const ColourPicker = ({
  anchor,
  value,
  others,
  onChange,
  onSwap,
  onConfirm,
  onCancel,
}: ColourPickerProps) => {
  const { t } = useTranslation(PAGE);
  const isMobile = useIsMobile();
  const { padding } = useSpacing();
  const [hsv, setHsv] = useState(() => rgbToHsv(value));
  const [alpha, setAlpha] = useState(value.a);
  const [hexText, setHexText] = useState<string | null>(null);
  const square = useRef<HTMLDivElement>(null);
  const width = isMobile ? 160 : 200;
  const listWidth = 160;
  const height = isMobile ? 110 : 140;

  const rgb = hsvToRgb(hsv.h, hsv.s, hsv.v);
  const hex = rgbaToHex({ ...rgb, a: 255 });

  const commit = (next: { h: number; s: number; v: number }, a = alpha) => {
    setHsv(next);
    setAlpha(a);
    setHexText(null);
    onChange({ ...hsvToRgb(next.h, next.s, next.v), a });
  };

  const hsvOf = (colour: { r: number; g: number; b: number }) => {
    const next = rgbToHsv(colour);
    return { h: next.s && next.v ? next.h : hsv.h, s: next.v ? next.s : hsv.s, v: next.v };
  };

  const setChannel = (key: 'r' | 'g' | 'b', raw: string) => {
    commit(hsvOf({ ...rgb, [key]: clamp(Number(raw)) }));
  };

  const pick = (event: PointerEvent<HTMLDivElement>) => {
    const box = square.current?.getBoundingClientRect();
    if (!box?.width || !box.height) return;
    const s = Math.min(Math.max((event.clientX - box.left) / box.width, 0), 1);
    const v = 1 - Math.min(Math.max((event.clientY - box.top) / box.height, 0), 1);
    commit({ h: hsv.h, s, v });
  };

  const copy = (item: { hex: string; rgba: Rgba }) => commit(hsvOf(item.rgba), item.rgba.a);

  const swap = (item: { hex: string; rgba: Rgba }) => {
    const previous = { ...rgb, a: alpha };
    copy(item);
    onSwap(item.hex, previous);
  };

  const onHex = (raw: string) => {
    const text = raw.replace(/^#/, '').slice(0, 6);
    setHexText(text);
    if (!/^[0-9a-f]{6}$/i.test(text)) return;
    const parsed = hexToRgba(text);
    if (parsed) commit(hsvOf(parsed));
  };

  return (
    <Popover
      open
      anchorEl={anchor}
      onClose={onCancel}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      transformOrigin={{ vertical: 'top', horizontal: 'left' }}
      slotProps={{
        paper: {
          sx: {
            background: FROSTED_BG,
            backdropFilter: 'blur(20px) saturate(250%)',
            border: 1,
            borderColor: 'divider',
            borderRadius: `${padding}px`,
            p: 1.5,
            display: 'flex',
            flexDirection: 'row',
            gap: 1.5,
          },
        },
      }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, width }}>
        <Typography variant='body1' color='text.secondary' noWrap>
          {t('pickColour')}
        </Typography>
        <Box
          ref={square}
          role='slider'
          aria-label={t('shade')}
          aria-valuetext={`${Math.round(hsv.s * 100)}% / ${Math.round(hsv.v * 100)}%`}
          onPointerDown={(event) => {
            event.currentTarget.setPointerCapture?.(event.pointerId);
            pick(event);
          }}
          onPointerMove={(event) => {
            if (event.buttons) pick(event);
          }}
          sx={{
            position: 'relative',
            width,
            height,
            borderRadius: 1,
            touchAction: 'none',
            cursor: 'crosshair',
            background: `linear-gradient(to top, #000, transparent), linear-gradient(to right, #fff, hsl(${hsv.h} 100% 50%))`,
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              left: `${hsv.s * 100}%`,
              top: `${(1 - hsv.v) * 100}%`,
              width: THUMB,
              height: THUMB,
              ml: `${-THUMB / 2}px`,
              mt: `${-THUMB / 2}px`,
              borderRadius: '50%',
              border: '2px solid #fff',
              boxShadow: '0 0 2px #000',
              pointerEvents: 'none',
            }}
          />
        </Box>
        <Slider
          aria-label={t('hue')}
          min={0}
          max={360}
          value={hsv.h}
          onChange={(_, h) => commit({ ...hsv, h: h as number })}
          sx={{
            '& .MuiSlider-rail': { background: RAINBOW, opacity: 1 },
            '& .MuiSlider-track': { display: 'none' },
          }}
        />
        <Box sx={{ display: 'flex', gap: 1 }}>
          {CHANNELS.map((key) => (
            <TextField
              key={key}
              size='small'
              type='number'
              label={t(CHANNEL_KEYS[key])}
              value={rgb[key]}
              onChange={(e) => setChannel(key, e.target.value)}
              slotProps={{ htmlInput: { min: 0, max: 255 } }}
              sx={NUMBER}
            />
          ))}
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <TextField
            size='small'
            label={t('hex')}
            value={hexText ?? hex}
            onChange={(e) => onHex(e.target.value)}
            slotProps={{ htmlInput: { maxLength: 7 } }}
            sx={FIELD}
          />
          <TextField
            size='small'
            type='number'
            label={t('alpha')}
            value={Math.round((alpha / 255) * 100)}
            onChange={(e) => commit(hsv, Math.round((clamp(Number(e.target.value), 100) / 100) * 255))}
            slotProps={{ htmlInput: { min: 0, max: 100 } }}
            sx={NUMBER}
          />
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Button onClick={onCancel}>{t('cancel')}</Button>
          <Button variant='contained' onClick={onConfirm}>
            {t('apply')}
          </Button>
        </Box>
      </Box>
      {others.length > 0 && (
        <>
          <SectionDividerVer slim />
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 1,
              alignSelf: 'stretch',
              width: listWidth + padding,
            }}
          >
            <Typography variant='body1' color='text.secondary' noWrap>
              {t('swapCopy')}
            </Typography>
            <Box sx={{ position: 'relative', flex: 1, minHeight: 0 }}>
              <Scroller axis='y' thickness={padding} style={{ position: 'absolute', inset: 0 }}>
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 0.5,
                    pr: `${padding}px`,
                  }}
                >
                  {others.map((item) => (
                    <Box key={item.hex} sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <Swatch rgba={item.rgba} size={20} border={GRAY[50]} />
                      <Typography variant='body1' sx={{ flex: 1 }}>
                        #{item.hex}
                      </Typography>
                      <IconButton
                        size='small'
                        aria-label={t('swapWith', { colour: item.hex })}
                        onClick={() => swap(item)}
                      >
                        <Shuffle fontSize='small' />
                      </IconButton>
                      <IconButton
                        size='small'
                        aria-label={t('copyColour', { colour: item.hex })}
                        onClick={() => copy(item)}
                      >
                        <ContentCopy fontSize='small' />
                      </IconButton>
                    </Box>
                  ))}
                </Box>
              </Scroller>
            </Box>
          </Box>
        </>
      )}
    </Popover>
  );
};

export default ColourPicker;
