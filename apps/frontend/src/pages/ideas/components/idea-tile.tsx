import Section from '@/common/components/sections/section';
import useInView from '@/common/hooks/use-in-view';
import useReveal from '@/common/hooks/use-reveal';
import SkeletonSection from '@/common/skeletons/sk-section';
import { PURPLE } from '@/common/utils/palette';
import IdeaTileContent from '@/pages/ideas/components/idea-tile-content';
import { type Idea, isEmpty } from '@/pages/ideas/utils/ideas';
import { PAGE } from '@/pages/ideas/utils/page';
import { useDraggable, useDroppable } from '@dnd-kit/core';
import Close from '@mui/icons-material/Close';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import { SyntheticEvent } from 'react';
import { useTranslation } from 'react-i18next';

type IdeaTileProps = {
  index: number;
  idea: Idea;
  onOpen: (index: number) => void;
  onClear: (index: number) => void;
  editable: boolean;
  revealDelay: number;
};

const stop = (e: SyntheticEvent) => e.stopPropagation();

const DraggableTile = ({ index, idea, onOpen, onClear, editable, revealDelay }: IdeaTileProps) => {
  const { t } = useTranslation(PAGE);
  const blank = isEmpty(idea);
  const draggable = editable && !blank;
  const openable = editable || !blank;
  const {
    attributes,
    listeners,
    setNodeRef: setDragRef,
    isDragging,
  } = useDraggable({ id: index, disabled: !draggable });
  const { setNodeRef: setDropRef, isOver } = useDroppable({ id: index, disabled: !editable });
  const { ref: revealRef, sx: revealSx } = useReveal({ trigger: 'mount', delay: revealDelay });

  return (
    <Box
      ref={(node: HTMLDivElement | null) => {
        setDragRef(node);
        setDropRef(node);
        revealRef.current = node;
      }}
      {...(draggable ? { ...listeners, ...attributes } : {})}
      role={openable ? 'button' : undefined}
      tabIndex={openable ? 0 : -1}
      onClick={() => openable && onOpen(index)}
      onKeyDown={(e) => openable && e.key === 'Enter' && onOpen(index)}
      sx={{
        flex: 1,
        display: 'flex',
        position: 'relative',
        minWidth: 0,
        minHeight: 0,
        touchAction: draggable ? 'manipulation' : undefined,
        cursor: draggable ? 'grab' : openable ? 'pointer' : 'default',
        ...revealSx,
      }}
    >
      <Section
        noMargin
        sx={{
          flex: 1,
          minWidth: 0,
          minHeight: 0,
          opacity: isDragging ? 0.4 : 1,
          ...(isOver && !isDragging ? { borderColor: PURPLE[0] } : {}),
        }}
      >
        {!blank && <IdeaTileContent idea={idea} />}
      </Section>
      {draggable && (
        <IconButton
          size='small'
          aria-label={t('clear')}
          onMouseDown={stop}
          onTouchStart={stop}
          onKeyDown={stop}
          onClick={(e) => {
            e.stopPropagation();
            onClear(index);
          }}
          sx={{ position: 'absolute', top: 4, right: 4 }}
        >
          <Close fontSize='small' />
        </IconButton>
      )}
    </Box>
  );
};

const IdeaTile = (props: IdeaTileProps) => {
  const { ref, inView } = useInView<HTMLDivElement>();

  return (
    <Box ref={ref} data-testid='idea-tile' sx={{ aspectRatio: '1 / 1', minWidth: 0, display: 'flex' }}>
      <SkeletonSection noMargin minHeight={0} sx={{ flex: 1, display: 'flex', minHeight: 0 }}>
        {inView && <DraggableTile {...props} />}
      </SkeletonSection>
    </Box>
  );
};

export default IdeaTile;
