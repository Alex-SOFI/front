import {
  FunctionComponent,
  HTMLAttributeAnchorTarget,
  PropsWithChildren,
} from 'react';

import { default as BasicLink } from '@mui/material/Link';

interface LinkProps extends PropsWithChildren {
  variant: 'body1' | 'body2' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  href: string;
  target?: HTMLAttributeAnchorTarget;
  margin?: string | number;
}

const Link1: FunctionComponent<LinkProps> = ({
  variant,
  href,
  target,
  margin,
  children,
}) => {
  return (
    <BasicLink
      variant={variant}
      color='inherit'
      underline='none'
      margin={margin}
      fontSize={20}
      href={href}
      target={target}
      aria-label='Visit sophie.fi main page which opens in a new window.'
    >
      {children}
    </BasicLink>
  );
};

export default Link1;
