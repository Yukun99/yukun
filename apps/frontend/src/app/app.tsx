import routes from '@/app/routes';
import { ScrollViewportContext } from '@/common/contexts/scroll-context';
import FloatingCircles from '@/common/components/effects/floating-circles';
import useDocumentTitle from '@/app/use-document-title';
import useNeedsRotate from '@/common/hooks/use-needs-rotate';
import Footer from '@/features/footer/footer';
import Navigation from '@/features/navigation/navigation';
import RotateGate from '@/features/rotate-gate/rotate-gate';
import Box from '@mui/material/Box';
import useResolvedMode from '@/common/hooks/use-resolved-mode';
import type { EventListeners } from 'overlayscrollbars';
import { OverlayScrollbarsComponent } from 'overlayscrollbars-react';
import 'overlayscrollbars/overlayscrollbars.css';
import { Suspense, useMemo, useState } from 'react';
import { useRoutes } from 'react-router-dom';

const AppRoutes = () => useRoutes(routes);

const App = () => {
  useDocumentTitle();
  const mode = useResolvedMode();
  const [viewport, setViewport] = useState<HTMLElement | null>(null);
  const needsRotate = useNeedsRotate();

  const events = useMemo<EventListeners>(
    () => ({ initialized: (instance) => setViewport(instance.elements().viewport) }),
    [],
  );

  if (needsRotate) return <RotateGate />;

  return (
    <Box sx={{ height: '100vh', width: '100vw', display: 'flex', flexDirection: 'column' }}>
      <FloatingCircles />
      <Navigation />
      <OverlayScrollbarsComponent
        defer
        events={events}
        options={{
          scrollbars: { theme: `os-theme-${mode}`, autoHide: 'scroll', autoHideDelay: 800 },
        }}
        style={{ flexGrow: 1, minHeight: 0 }}
      >
        <ScrollViewportContext.Provider value={viewport}>
          <Suspense fallback={null}>
            <AppRoutes />
          </Suspense>
          <Footer />
        </ScrollViewportContext.Provider>
      </OverlayScrollbarsComponent>
    </Box>
  );
};

export default App;
