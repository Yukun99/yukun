import Section from '@/common/components/sections/section';
import { useEditorContext } from '@/common/contexts/editor-context';
import useIsMobile from '@/common/hooks/use-is-mobile';
import useSpacing from '@/common/hooks/use-spacing';
import useViewportSize from '@/common/hooks/use-viewport-size';
import DeleteDialog from '@/pages/3d/components/delete-dialog';
import ModelList from '@/pages/3d/components/model-list';
import ModelViewer from '@/pages/3d/components/model-viewer';
import UploadDialog from '@/pages/3d/components/upload-dialog';
import useModels from '@/pages/3d/use-models';
import { fileUrl, type Model } from '@/pages/3d/utils/models';
import Page from '@/pages/page';
import Box from '@mui/material/Box';
import { useState } from 'react';

const ThreeD = () => {
  const isMobile = useIsMobile();
  const { margin } = useSpacing();
  const { height } = useViewportSize();
  const { token, editor, signOut } = useEditorContext();
  const { models, ready, selected, select, upload, remove } = useModels(token, signOut);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [deleting, setDeleting] = useState<Model | null>(null);
  const editable = editor && ready;

  return (
    <Page>
      <Box sx={{ display: 'flex', height: height - margin * 2 }}>
        <Section noMargin noPadding sx={{ flex: 1, minWidth: 0, height: '100%' }}>
          {selected !== null && (
            <Box sx={{ width: '100%', height: '100%' }}>
              <ModelViewer key={selected} url={fileUrl(selected)} />
            </Box>
          )}
        </Section>
        <Section
          noMargin
          sx={{ width: isMobile ? 180 : 280, marginLeft: `${margin}px`, height: '100%' }}
        >
          <ModelList
            models={models}
            selected={selected}
            onSelect={select}
            editable={editable}
            onUpload={() => setUploadOpen(true)}
            onDelete={setDeleting}
          />
        </Section>
      </Box>
      <UploadDialog open={uploadOpen} onClose={() => setUploadOpen(false)} onUpload={upload} />
      <DeleteDialog
        model={deleting}
        onClose={() => setDeleting(null)}
        onConfirm={() => {
          if (deleting) remove(deleting.id);
          setDeleting(null);
        }}
      />
    </Page>
  );
};

export default ThreeD;
