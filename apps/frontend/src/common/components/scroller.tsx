import { getColor, GRAY, OPACITY } from '@/common/utils/palette';
import { styled, type Theme } from '@mui/material/styles';
import type { SystemStyleObject } from '@mui/system';
import type { EventListeners, PartialOptions } from 'overlayscrollbars';
import { OverlayScrollbarsComponent } from 'overlayscrollbars-react';
import 'overlayscrollbars/overlayscrollbars.css';
import { ReactNode, useMemo } from 'react';

export const HANDLE_WIDTH = 6;
const HANDLE_BG = getColor(GRAY[50], OPACITY[50]);
const HANDLE_BG_HOVER = getColor(GRAY[50], OPACITY[65]);
const HANDLE_BG_ACTIVE = getColor(GRAY[50], OPACITY[80]);

const Host = styled(OverlayScrollbarsComponent)({});

export type ScrollerProps = {
  axis?: 'x' | 'y';
  thickness?: number;
  inset?: number;
  onViewport?: (viewport: HTMLElement | null) => void;
  viewportStyle?: SystemStyleObject<Theme>;
  style?: SystemStyleObject<Theme>;
  children?: ReactNode;
};

/**
 * overlay scroll container; the handle is centred in a strip `thickness` wide along the
 * scrolling edge and stops `inset` short of each end
 */
const Scroller = ({
  axis,
  thickness = 10,
  inset = 2,
  onViewport,
  viewportStyle = {},
  style,
  children,
}: ScrollerProps) => {
  const options = useMemo<PartialOptions>(
    () => ({
      ...(axis && {
        overflow: { x: axis === 'x' ? 'scroll' : 'hidden', y: axis === 'y' ? 'scroll' : 'hidden' },
      }),
      scrollbars: { theme: null, autoHide: 'never' },
    }),
    [axis],
  );
  const events = useMemo<EventListeners>(
    () => ({
      initialized: (instance) => onViewport?.(instance.elements().viewport),
      destroyed: () => onViewport?.(null),
    }),
    [onViewport],
  );

  return (
    <Host
      defer
      options={options}
      events={events}
      sx={{
        '& > .os-scrollbar': {
          boxSizing: 'border-box',
          '--os-size': `${thickness}px`,
          '--os-padding-axis': `${inset}px`,
          '--os-padding-perpendicular': `${(thickness - HANDLE_WIDTH) / 2}px`,
          '--os-handle-border-radius': `${HANDLE_WIDTH}px`,
          '--os-handle-interactive-area-offset': '4px',
          '--os-handle-bg': HANDLE_BG,
          '--os-handle-bg-hover': HANDLE_BG_HOVER,
          '--os-handle-bg-active': HANDLE_BG_ACTIVE,
        },
        '& > [data-overlayscrollbars-contents]': viewportStyle,
        ...style,
      }}
    >
      {children}
    </Host>
  );
};

export default Scroller;
