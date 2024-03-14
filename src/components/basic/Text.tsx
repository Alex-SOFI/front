/* eslint-disable @typescript-eslint/no-explicit-any */
import { FunctionComponent, PropsWithChildren } from 'react';

import Typography from '@mui/material/Typography';

interface TextProps extends PropsWithChildren {
  variant?: 'body1' | 'body2' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  color?: string;
  fontSize?: string | number;
  fontWeight?: number;
  alignSelf?: string;
  [x: string]: any;
}

const Text: FunctionComponent<TextProps> = ({
  variant,
  color,
  fontSize,
  children,
  fontWeight,
  alignSelf,
  ...props
}) => {
  return (
    <Typography
      color={color || 'black'}
      variant={variant}
      {...(fontSize ? { fontSize } : {})}
      {...props}
      {...(fontWeight ? { fontWeight } : {})}
      {...(alignSelf ? { alignSelf } : {})}
    >
      {children}
    </Typography>
  );
};

export default Text;
