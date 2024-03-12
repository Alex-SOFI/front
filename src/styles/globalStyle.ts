import { css } from '@emotion/react';
import emotionNormalize from 'emotion-normalize';

import { createTheme } from '@mui/material/styles';

import { theme } from './theme';

export const globalStyle = css`
  ${emotionNormalize}
  *:after,
  *:before {
    box-sizing: border-box;
  }

  * {
    -webkit-tap-highlight-color: transparent;
  }

  body,
  html {
    height: 100%;
    scroll-behavior: smooth;
  }

  body {
    font-family: ${theme.fonts.main};
    font-weight: 400;
    overflow-x: hidden;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;

    &.no-scroll {
      touch-action: none;
      overscroll-behavior: contain;
      overflow: hidden;
    }
  }
`;

export const muiTheme = createTheme({
  typography: {
    allVariants: {
      fontFamily: theme.fonts.main,
      textTransform: 'none',
      fontSize: 18,
      fontWeight: 400,
    },
    button: { fontWeight: 500 },
  },
  palette: {
    primary: {
      main: theme.colors.primary,
    },
  },
  breakpoints: {
    unit: 'em',
    values: {
      xs: 23.5,
      sm: 40,
      md: 56.25,
      lg: 64,
      xl: 85,
    },
  },
});
