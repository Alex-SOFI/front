import { FunctionComponent, MouseEvent, useCallback, useState } from 'react';

import MenuIcon from '@mui/icons-material/Menu';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import useMagic from 'hooks/useMagic';

import ButtonWithIcon from './ButtonWithIcon';

const AppMenu: FunctionComponent = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const { logoutUser } = useMagic(window.location.pathname);

  const logout = useCallback(async () => {
    handleClose();
    await logoutUser();
  }, [logoutUser]);

  return (
    <>
      <ButtonWithIcon
        ariaControls={open ? 'basic-menu' : undefined}
        ariaHaspopup
        ariaExpanded={open ? true : undefined}
        ariaLabel='Menu button'
        onClick={handleClick}
        size='small'
      >
        <MenuIcon />
      </ButtonWithIcon>
      <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
        <MenuItem onClick={() => logout()}>Logout</MenuItem>
      </Menu>
    </>
  );
};

export default AppMenu;
