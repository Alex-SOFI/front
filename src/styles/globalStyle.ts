import { css } from '@emotion/react';
import { createTheme } from '@mui/material/styles';
import emotionNormalize from 'emotion-normalize';

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
    font-size: ${theme.fontSizes.md};
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
});
