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
      }}
      onClick={onClick}
      disabled={disabled || false}
      aria-label={ariaLabel}
    >
      {children}
    </BasicButton>
  );
};

export default Button;
