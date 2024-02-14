/* eslint-disable @typescript-eslint/no-explicit-any */
import { FunctionComponent, PropsWithChildren } from 'react';

import { default as BasicButton } from '@mui/material/Button';

interface ButtonProps extends PropsWithChildren {
  onClick: () => void;
  type?: 'submit' | 'reset' | undefined;
  variant?: 'text';
  isPrimaryColor?: boolean;
  disabled?: boolean;
  maxWidth?: string;
  minWidth?: string;
  ariaLabel?: string;
  fullWidth?: boolean;
  minHeight?: string;
  gridColumn?: number;
  textColor?: string;
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
  minHeight,
  textColor,
  ...props
}) => {
  return (
    <BasicButton
      {...(variant ? { color: isPrimaryColor ? 'primary' : 'inherit' } : {})}
      variant={variant || 'contained'}
      type={type || 'button'}
      sx={{
        boxShadow: 0,
        minHeight: minHeight || '2.719rem',
        textAlign: 'right',
        ...(variant
          ? { fontWeight: isPrimaryColor ? 500 : 400, padding: '0px' }
          : {}),
        ...(maxWidth ? { maxWidth } : {}),
        ...(minWidth ? { minWidth } : {}),
        ...(textColor ? { color: textColor } : {}),
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
