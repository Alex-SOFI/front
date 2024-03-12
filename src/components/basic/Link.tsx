import { FunctionComponent, PropsWithChildren } from 'react';

import { default as BasicLink } from '@mui/material/Link';

interface LinkProps extends PropsWithChildren {
  variant?: 'body1' | 'body2' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  href: string;
  margin?: string | number;
  ariaLabel?: string;
  withoutTarget?: boolean;
}

const Link: FunctionComponent<LinkProps> = ({
  variant,
  href,
  margin,
  ariaLabel,
  children,
  withoutTarget,
}) => {
  return (
    <BasicLink
      variant={variant || 'h6'}
      color='inherit'
      underline='none'
      margin={margin}
      fontSize={20}
      href={href}
      {...(withoutTarget ? {} : { target: '_blank' })}
      aria-label={ariaLabel}
    >
      {children}
    </BasicLink>
  );
};

export default Link;
