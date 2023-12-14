import { FunctionComponent, PropsWithChildren } from 'react';

import { default as BasicButton } from '@mui/material/Button';

interface ButtonProps extends PropsWithChildren {
  onClick: () => void;
  type?: 'submit' | 'reset' | undefined;
  variant?: 'text';
  isPrimaryColor?: boolean;
}

const Button: FunctionComponent<ButtonProps> = ({
  onClick,
  type,
  variant,
  isPrimaryColor,
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
    >
      {children}
    </BasicButton>
  );
};

export default Button;
