import { FunctionComponent, PropsWithChildren } from 'react';

import IconButton from '@mui/material/IconButton';

interface IconButtonProps extends PropsWithChildren {
  onClick: () => void;
  maxHeight?: string;
  color?: string;
}

const ButtonWithIcon: FunctionComponent<IconButtonProps> = ({
  onClick,
  maxHeight,
  color,
  children,
}) => {
  return (
    <IconButton
      type={'button'}
      sx={{ boxShadow: 0 }}
      onClick={onClick}
      size='large'
      style={{
        ...(color ? { color } : {}),
        ...(maxHeight ? { maxHeight, width: maxHeight } : {}),
      }}
    >
      {children}
    </IconButton>
  );
};

export default ButtonWithIcon;
