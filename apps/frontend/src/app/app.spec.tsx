import App from '@/app/app';
import '@/locales/i18n';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';

const theme = createTheme({
  colorSchemes: { light: true, dark: true },
  cssVariables: { colorSchemeSelector: 'class' },
});

const renderApp = () =>
  render(
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <App />
      </ThemeProvider>
    </BrowserRouter>,
  );

describe('App', () => {
  it('should render successfully', () => {
    const { baseElement } = renderApp();
    expect(baseElement).toBeTruthy();
  });
});
