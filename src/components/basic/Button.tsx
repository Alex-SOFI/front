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
}

const Button: FunctionComponent<ButtonProps> = ({
  onClick,
  type,
  variant,
  isPrimaryColor,
  disabled,
  children,
}) => {
  return (
    <BasicButton
      {...(variant ? { color: isPrimaryColor ? 'primary' : 'inherit' } : {})}
      variant={variant || 'contained'}
      type={type || 'button'}
      sx={{
        boxShadow: 0,
        ...(variant ? { fontWeight: isPrimaryColor ? 500 : 400 } : {}),
      }}
      onClick={onClick}
      disabled={disabled || false}
    >
      {children}
    </BasicButton>
  );
};

export default Button;
