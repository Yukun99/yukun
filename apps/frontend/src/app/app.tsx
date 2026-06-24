import Navigation from '@/features/navigation/navigation';
import { useRoutes } from 'react-router-dom';
import routes from '@/app/routes';
import { Suspense } from 'react';
import bg from '@/assets/bg.jpg';
import Box from '@mui/material/Box';
import { OPACITY } from '@/app/palette';
import useDocumentTitle from '@/common/hooks/use-document-title';

const AppRoutes = () => useRoutes(routes);

const App = () => {
  useDocumentTitle();

  return (
    <Box
      sx={{
        height: '100vh',
        width: '100vw',
        '&::before': {
          content: '""',
          position: 'absolute',
          inset: 0,
          zIndex: -1,
          backgroundImage: `url(${bg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: OPACITY[10],
        },
      }}
    >
      <Navigation />
      <Suspense fallback={null}>
        <AppRoutes />
      </Suspense>
    </Box>
  );
};

export default App;