import routes from '@/app/routes';
import { ScrollToTopContext } from '@/app/scroll-context';
import FloatingCircles from '@/common/components/effects/floating-circles';
import useDocumentTitle from '@/common/hooks/use-document-title';
import Footer from '@/features/footer/footer';
import Navigation from '@/features/navigation/navigation';
import Box from '@mui/material/Box';
import { useColorScheme } from '@mui/material/styles';
import type { OverlayScrollbarsComponentRef } from 'overlayscrollbars-react';
import { OverlayScrollbarsComponent } from 'overlayscrollbars-react';
import 'overlayscrollbars/overlayscrollbars.css';
import { Suspense, useRef } from 'react';
import { useRoutes } from 'react-router-dom';

const AppRoutes = () => useRoutes(routes);

const App = () => {
  useDocumentTitle();
  const { mode } = useColorScheme();
  const scrollRef = useRef<OverlayScrollbarsComponentRef>(null);

  function scrollToTop() {
    const viewport = scrollRef.current?.osInstance()?.elements().viewport;
    viewport?.scrollTo({ top: 0, behavior: 'smooth' });
  }

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
          <Suspense fallback={null}>
            <AppRoutes />
          </Suspense>
          <Footer />
        </ScrollToTopContext.Provider>
      </OverlayScrollbarsComponent>
    </Box>
  );
};

export default App;