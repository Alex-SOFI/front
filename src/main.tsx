import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';

import { Global } from '@emotion/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider } from 'wagmi';

import wagmiConfig from 'configs/wagmiConfig';

import { ThemeProvider } from '@mui/material/styles';
import { globalStyle, muiTheme } from 'styles/globalStyle';

import App from './App';
import { store } from './store';

const queryClient = new QueryClient();

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement,
);
root.render(
  <>
    <Provider store={store}>
      <WagmiProvider config={wagmiConfig}>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider theme={muiTheme}>
            <Global styles={globalStyle} />
            <App />
          </ThemeProvider>
        </QueryClientProvider>
      </WagmiProvider>
    </Provider>
  </>,
);
