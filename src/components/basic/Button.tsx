/* eslint-disable @typescript-eslint/no-explicit-any */
import { FunctionComponent, PropsWithChildren } from 'react';

import { default as BasicButton } from '@mui/material/Button';

interface ButtonProps extends PropsWithChildren {
  onClick: () => void;
  type?: 'submit' | 'reset' | undefined;
  variant?: 'text';
  isPrimaryColor?: boolean;
  disabled?: boolean;
  marginLeft?: string;
  maxWidth?: string;
  minWidth?: string;
  ariaLabel?: string;
  fullWidth?: boolean;
  [x: string]: any;
}

const Button: FunctionComponent<ButtonProps> = ({
  onClick,
  type,
  variant,
  isPrimaryColor,
  disabled,
  maxWidth,
  minWidth,
  children,
  ariaLabel,
  fullWidth,
  ...props
}) => {
  return (
    <BasicButton
      {...(variant ? { color: isPrimaryColor ? 'primary' : 'inherit' } : {})}
      variant={variant || 'contained'}
      type={type || 'button'}
      sx={{
        boxShadow: 0,
        minHeight: '2.719rem',
        ...(variant
          ? { fontWeight: isPrimaryColor ? 500 : 400, padding: '0px' }
          : {}),
        ...(maxWidth ? { maxWidth } : {}),
        ...(minWidth ? { minWidth } : {}),
        ...props,
      }}
      onClick={onClick}
      disabled={disabled || false}
      aria-label={ariaLabel}
      fullWidth={fullWidth}
    >
      {children}
    </BasicButton>
  );
};

export default Button;
