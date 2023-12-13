import { FunctionComponent, PropsWithChildren } from 'react';

import { default as BasicButton } from '@mui/material/Button';

interface ButtonProps extends PropsWithChildren {
  onClick: () => void;
  type?: 'submit' | 'reset' | undefined;
}

const Button: FunctionComponent<ButtonProps> = ({
  onClick,
  type,
  children,
}) => {
  return (
    <BasicButton
      variant='contained'
      type={type || 'button'}
      sx={{ boxShadow: 0 }}
      onClick={onClick}
    >
      {children}
    </BasicButton>
  );
};

export default Button;
