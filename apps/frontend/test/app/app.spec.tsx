import App from '@/app/app';
import theme from '@/app/theme';
import '@/locales/i18n';
import { ThemeProvider } from '@mui/material/styles';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';

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
