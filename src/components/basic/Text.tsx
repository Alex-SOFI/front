/* eslint-disable @typescript-eslint/no-explicit-any */
import { FunctionComponent, PropsWithChildren } from 'react';

import Typography from '@mui/material/Typography';

interface TextProps extends PropsWithChildren {
  variant: 'body1' | 'body2' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  color?: string;
  [x: string]: any;
}

const Text: FunctionComponent<TextProps> = ({
  variant,
  color,
  children,
  ...props
}) => {
  return (
    <Typography color={color ? color : 'black'} variant={variant} {...props}>
      {children}
    </Typography>
  );
};

export default Text;
