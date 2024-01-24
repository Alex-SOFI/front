import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';

import { Global } from '@emotion/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createWeb3Modal } from '@web3modal/wagmi/react';
import { WagmiProvider } from 'wagmi';

import wagmiConfig from 'configs/wagmiConfig';

import { chains, projectId } from 'constants/wagmiConfig';

import { ThemeProvider } from '@mui/material/styles';
import { globalStyle, muiTheme } from 'styles/globalStyle';

import App from './App';
import { store } from './store';

const queryClient = new QueryClient();

createWeb3Modal({ wagmiConfig, projectId, chains, themeMode: 'light' });

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
