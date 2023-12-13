import { FunctionComponent } from 'react';

import Box from '@mui/material/Box';

import { Button } from '../components/basic';
import { muiTheme } from '../styles/globalStyle';
import { Link } from './basic';

interface HeaderProps {
  onClick: () => void;
}

const Header: FunctionComponent<HeaderProps> = ({ onClick }) => {
  return (
    <Box
      display='flex'
      justifyContent='space-between'
      margin={muiTheme.spacing(1, 2)}
    >
      <Link
        margin={muiTheme.spacing(1)}
        variant='h6'
        href='https://www.sophie.fi/'
        target='_blank'
      >
        sophie.fi
      </Link>
      <Button onClick={onClick}>Connect Wallet</Button>
    </Box>
  );
};

export default Header;
