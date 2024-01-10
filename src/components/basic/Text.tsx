/* eslint-disable @typescript-eslint/no-explicit-any */
import { FunctionComponent, PropsWithChildren } from 'react';

import Typography from '@mui/material/Typography';

interface TextProps extends PropsWithChildren {
  variant?: 'body1' | 'body2' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  color?: string;
  fontSize?: string;
  fontWeight?: number;
  [x: string]: any;
}

const Text: FunctionComponent<TextProps> = ({
  variant,
  color,
  fontSize,
  children,
  fontWeight,
  ...props
}) => {
  return (
    <Typography
      color={color || 'black'}
      variant={variant}
      {...(fontSize ? { fontSize } : {})}
      {...props}
      {...(fontWeight ? { fontWeight } : {})}
    >
      {children}
    </Typography>
  );
};

export default Text;
