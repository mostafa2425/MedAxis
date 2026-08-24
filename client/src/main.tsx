import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import App from './App';
import './i18n';
import './styles/global.scss';
import { medAxisAntdTheme } from './styles/antdTheme';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 30_000, retry: 1, refetchOnWindowFocus: false },
  },
});

const direction = document.documentElement.dir === 'rtl' ? 'rtl' : 'ltr';

if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    void navigator.serviceWorker.register('/sw.js');
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ConfigProvider theme={medAxisAntdTheme} direction={direction} componentSize="middle">
      <QueryClientProvider client={queryClient}>
        <BrowserRouter><App /></BrowserRouter>
      </QueryClientProvider>
    </ConfigProvider>
  </StrictMode>,
);
