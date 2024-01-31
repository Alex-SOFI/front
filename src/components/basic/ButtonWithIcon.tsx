import { FunctionComponent, MouseEvent, PropsWithChildren } from 'react';

import IconButton from '@mui/material/IconButton';

interface IconButtonProps extends PropsWithChildren {
  onClick: (() => void) | ((event: MouseEvent<HTMLButtonElement>) => void);
  maxHeight?: string;
  color?: string;
  ariaLabel: string;
  disabled?: boolean;
  ariaControls?: string | undefined;
  ariaHaspopup?: boolean | undefined;
  ariaExpanded?: boolean | undefined;
  size?: 'small' | 'large' | 'medium';
}

const ButtonWithIcon: FunctionComponent<IconButtonProps> = ({
  onClick,
  maxHeight,
  color,
  ariaLabel,
  disabled,
  children,
  ariaControls,
  ariaHaspopup,
  ariaExpanded,
  size,
}) => {
  return (
    <IconButton
      type={'button'}
      sx={{ boxShadow: 0 }}
      onClick={onClick}
      size={size || 'large'}
      aria-label={ariaLabel}
      style={{
        ...(color ? { color } : {}),
        ...(maxHeight ? { maxHeight, width: maxHeight } : {}),
      }}
      disabled={disabled || false}
      aria-controls={ariaControls}
      aria-haspopup={ariaHaspopup}
      aria-expanded={ariaExpanded}
    >
      {children}
    </IconButton>
  );
};

export default ButtonWithIcon;
