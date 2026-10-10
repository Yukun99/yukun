import RoundIconButton from '@/common/components/buttons/round-icon-button';
import Section from '@/common/components/sections/section';
import useIsMobile from '@/common/hooks/use-is-mobile';
import useSpacing from '@/common/hooks/use-spacing';
import { PAGE } from '@/pages/catalog/utils/page';
import IdeaDialog from '@/pages/ideas/components/idea-dialog';
import IdeaTile from '@/pages/ideas/components/idea-tile';
import IdeaTileContent from '@/pages/ideas/components/idea-tile-content';
import { clear, type Idea, swap, update } from '@/pages/ideas/utils/ideas';
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
import Edit from '@mui/icons-material/Edit';
import Visibility from '@mui/icons-material/Visibility';
import Box from '@mui/material/Box';
import { useState } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';

const KEYS = ['edit', 'drag', 'modes'] as const;

const Week14Example = () => {
  const { t } = useTranslation(PAGE);
  const isMobile = useIsMobile();
  const { margin } = useSpacing();
  const [ideas, setIdeas] = useState<Idea[]>(() =>
    KEYS.slice(0, isMobile ? 2 : KEYS.length).map((key) => ({
      title: t(`week14.${key}.title`),
      content: t(`week14.${key}.content`),
    })),
  );
  const [editable, setEditable] = useState(true);
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 200, tolerance: 8 } }),
  );
  const cols = isMobile ? 2 : 3;

  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    if (over && active.id !== over.id) {
      setIdeas((current) => swap(current, Number(active.id), Number(over.id)));
    }
    setActiveIndex(null);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <RoundIconButton
          icon={Visibility}
          label={t('week14.read')}
          onClick={() => setEditable(false)}
        />
        <RoundIconButton icon={Edit} label={t('week14.write')} onClick={() => setEditable(true)} />
      </Box>
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
              onClear={(i) => setIdeas((current) => clear(current, i))}
              editable={editable}
              revealDelay={(index % cols) * 150}
            />
          ))}
        </Box>
        {createPortal(
          <DragOverlay dropAnimation={null}>
            {activeIndex !== null && (
              <Section noMargin sx={{ width: '100%', height: '100%' }}>
                <IdeaTileContent idea={ideas[activeIndex]} />
              </Section>
            )}
          </DragOverlay>,
          document.body,
        )}
      </DndContext>
      <IdeaDialog
        editable={editable}
        idea={openIndex === null ? null : ideas[openIndex]}
        onChange={(idea) =>
          openIndex !== null && setIdeas((current) => update(current, openIndex, idea))
        }
        onClose={() => setOpenIndex(null)}
      />
    </Box>
  );
};

export default Week14Example;
