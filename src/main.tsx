import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';

import { Global } from '@emotion/react';
import { ThemeProvider } from '@mui/material/styles';
import { WagmiConfig } from 'wagmi';

import App from './App';
import wagmiConfig from './configs/wagmiConfig';
import { store } from './store';
import { globalStyle, muiTheme } from './styles/globalStyle';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement,
);
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <WagmiConfig config={wagmiConfig}>
        <ThemeProvider theme={muiTheme}>
          <Global styles={globalStyle} />
          <App />
        </ThemeProvider>
      </WagmiConfig>
    </Provider>
  </React.StrictMode>,
);
