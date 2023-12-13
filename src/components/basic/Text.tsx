import { FunctionComponent, PropsWithChildren } from 'react';

import Typography from '@mui/material/Typography';

interface TextProps extends PropsWithChildren {
  variant: 'body1' | 'body2' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
}

const Text: FunctionComponent<TextProps> = ({ variant, children }) => {
  return <Typography variant={variant}>{children}</Typography>;
};

export default Text;
