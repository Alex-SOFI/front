import React from 'react';
import ReactDOM from 'react-dom/client';

import { Global } from '@emotion/react';
import { ThemeProvider } from '@mui/material/styles';

import App from './App';
import { globalStyle, muiTheme } from './styles/globalStyle';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement,
);
root.render(
  <React.StrictMode>
    <ThemeProvider theme={muiTheme}>
      <Global styles={globalStyle} />
      <App />
    </ThemeProvider>
  </React.StrictMode>,
);
