import { FunctionComponent } from 'react';

import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import IconButton from '@mui/material/IconButton';

interface IconButtonProps {
  onClick: () => void;
  isArrowDownward: boolean;
}

const ButtonWithIcon: FunctionComponent<IconButtonProps> = ({
  onClick,
  isArrowDownward,
}) => {
  return (
    <IconButton
      type={'button'}
      sx={{ boxShadow: 0 }}
      onClick={onClick}
      size='large'
    >
      {isArrowDownward ? (
        <ArrowDownwardIcon aria-label='mint' fontSize='large' />
      ) : (
        <ArrowUpwardIcon aria-label='redeem' fontSize='large' />
      )}
    </IconButton>
  );
};

export default ButtonWithIcon;
