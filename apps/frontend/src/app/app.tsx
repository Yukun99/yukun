import routes from '@/app/routes';
import { ScrollToTopContext, ScrollViewportContext } from '@/common/contexts/scroll-context';
import FloatingCircles from '@/common/components/effects/floating-circles';
import useDocumentTitle from '@/app/use-document-title';
import useNeedsRotate from '@/common/hooks/use-needs-rotate';
import Footer from '@/features/footer/footer';
import Navigation from '@/features/navigation/navigation';
import RotateGate from '@/features/rotate-gate/rotate-gate';
import Box from '@mui/material/Box';
import useResolvedMode from '@/common/hooks/use-resolved-mode';
import type { OverlayScrollbarsComponentRef } from 'overlayscrollbars-react';
import { OverlayScrollbarsComponent } from 'overlayscrollbars-react';
import 'overlayscrollbars/overlayscrollbars.css';
import { Suspense, useCallback, useRef } from 'react';
import { useRoutes } from 'react-router-dom';

const AppRoutes = () => useRoutes(routes);

const App = () => {
  useDocumentTitle();
  const mode = useResolvedMode();
  const scrollRef = useRef<OverlayScrollbarsComponentRef>(null);
  const needsRotate = useNeedsRotate();

  function scrollToTop() {
    const viewport = scrollRef.current?.osInstance()?.elements().viewport;
    viewport?.scrollTo({ top: 0, behavior: 'smooth' });
  }

  const getScrollViewport = useCallback(
    () => scrollRef.current?.osInstance()?.elements().viewport ?? null,
    [],
  );

  if (needsRotate) return <RotateGate />;

  return (
    <Box sx={{ height: '100vh', width: '100vw', display: 'flex', flexDirection: 'column' }}>
      <FloatingCircles />
      <Navigation />
      <OverlayScrollbarsComponent
        ref={scrollRef}
        defer
        options={{
          scrollbars: { theme: `os-theme-${mode}`, autoHide: 'scroll', autoHideDelay: 800 },
        }}
        style={{ flexGrow: 1, minHeight: 0 }}
      >
        <ScrollToTopContext.Provider value={scrollToTop}>
          <ScrollViewportContext.Provider value={getScrollViewport}>
            <Suspense fallback={null}>
              <AppRoutes />
            </Suspense>
            <Footer />
          </ScrollViewportContext.Provider>
        </ScrollToTopContext.Provider>
      </OverlayScrollbarsComponent>
    </Box>
  );
};

export default App;
