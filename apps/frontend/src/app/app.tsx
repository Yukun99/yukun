import Navigation from '@/features/navigation/navigation';
import { BrowserRouter, useRoutes } from 'react-router-dom';
import routes from '@/app/routes';
import { Suspense } from 'react';
import bg from '@/assets/bg.jpg';
import Box from '@mui/material/Box';
import { OPACITY } from '@/app/palette';

const AppRoutes = () => useRoutes(routes);

const App = () => {
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
      <BrowserRouter>
        <Suspense fallback={null}>
          <AppRoutes />
        </Suspense>
      </BrowserRouter>
    </Box>
  );
};

export default App;