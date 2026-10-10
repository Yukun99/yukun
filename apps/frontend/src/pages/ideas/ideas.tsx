import { getFormattedIcon } from '@/common/components/buttons/round-icon-button';
import { useEditorContext } from '@/common/contexts/editor-context';
import Section, { FROSTED_BG } from '@/common/components/sections/section';
import useIsMobile from '@/common/hooks/use-is-mobile';
import useSpacing from '@/common/hooks/use-spacing';
import { PURPLE } from '@/common/utils/palette';
import IdeaDialog from '@/pages/ideas/components/idea-dialog';
import IdeaTile from '@/pages/ideas/components/idea-tile';
import IdeaTileContent from '@/pages/ideas/components/idea-tile-content';
import useIdeas from '@/pages/ideas/use-ideas';
import { COLS } from '@/pages/ideas/utils/ideas';
import { PAGE } from '@/pages/ideas/utils/page';
import Page from '@/pages/page';
import {
  closestCenter,
  DndContext,
  type DragEndEvent,
  DragOverlay,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import Add from '@mui/icons-material/Add';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

const Ideas = () => {
  const { t } = useTranslation(PAGE);
  const isMobile = useIsMobile();
  const { margin, padding } = useSpacing();
  const { token, editor, signOut } = useEditorContext();
  const { ideas, ready, setIdea, clearIdea, swapIdeas, addRow } = useIdeas(token, signOut);
  const editable = editor && ready;
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 200, tolerance: 8 } }),
  );
  const cols = isMobile ? 3 : COLS;

  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    if (over && active.id !== over.id) swapIdeas(Number(active.id), Number(over.id));
    setActiveIndex(null);
  };

  return (
    <Page>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={({ active }) => setActiveIndex(Number(active.id))}
        onDragEnd={handleDragEnd}
        onDragCancel={() => setActiveIndex(null)}
      >
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
            gap: `${margin * 2}px`,
            margin: `${margin}px`,
          }}
        >
          {ideas.map((idea, index) => (
            <IdeaTile
              key={index}
              index={index}
              idea={idea}
              onOpen={setOpenIndex}
              onClear={clearIdea}
              editable={editable}
              revealDelay={(index % cols) * 150}
            />
          ))}
        </Box>
        <DragOverlay dropAnimation={null}>
          {activeIndex !== null && (
            <Section noMargin sx={{ width: '100%', height: '100%' }}>
              <IdeaTileContent idea={ideas[activeIndex]} />
            </Section>
          )}
        </DragOverlay>
      </DndContext>
      {editable && (
        <Button
          fullWidth
          variant='text'
          onClick={addRow}
          sx={{
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: `${padding}px`,
            boxShadow: (theme) => theme.shadows[16],
            background: FROSTED_BG,
            margin: `${margin}px`,
            width: `calc(100% - ${margin * 2}px)`,
            minHeight: isMobile ? 48 : 64,
            gap: 1,
          }}
        >
          {getFormattedIcon(Add, 40, false, 1)}
          <Typography variant='button' sx={{ color: PURPLE[0] }}>
            {t('addRow')}
          </Typography>
        </Button>
      )}
      <IdeaDialog
        editable={editable}
        idea={openIndex === null ? null : ideas[openIndex]}
        onChange={(idea) => openIndex !== null && setIdea(openIndex, idea)}
        onClose={() => setOpenIndex(null)}
      />
    </Page>
  );
};

export default Ideas;
