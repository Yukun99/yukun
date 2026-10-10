import routes from '@/app/routes';
import { ScrollViewportContext } from '@/common/contexts/scroll-context';
import FloatingCircles from '@/common/components/effects/floating-circles';
import Scroller from '@/common/components/scroller';
import useDocumentTitle from '@/app/use-document-title';
import useNeedsRotate from '@/common/hooks/use-needs-rotate';
import EditorProvider from '@/features/auth/editor-provider';
import Footer from '@/features/footer/footer';
import Navigation from '@/features/navigation/navigation';
import RotateGate from '@/features/rotate-gate/rotate-gate';
import Box from '@mui/material/Box';
import { Suspense, useState } from 'react';
import { useRoutes } from 'react-router-dom';

const AppRoutes = () => useRoutes(routes);

const App = () => {
  useDocumentTitle();
  const [viewport, setViewport] = useState<HTMLElement | null>(null);
  const needsRotate = useNeedsRotate();

  return (
    <EditorProvider>
      {needsRotate ? (
        <RotateGate />
      ) : (
        <Box sx={{ height: '100vh', width: '100vw', display: 'flex', flexDirection: 'column' }}>
          <FloatingCircles />
          <Navigation />
          <Scroller onViewport={setViewport} style={{ flexGrow: 1, minHeight: 0 }}>
            <ScrollViewportContext.Provider value={viewport}>
              <Suspense fallback={null}>
                <AppRoutes />
              </Suspense>
              <Footer />
            </ScrollViewportContext.Provider>
          </Scroller>
        </Box>
      )}
    </EditorProvider>
  );
};

export default App;
