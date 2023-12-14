import { FunctionComponent } from 'react';

import styled from '@emotion/styled';

import { Button } from '../components/basic';
import { muiTheme } from '../styles/globalStyle';
import { Link } from './basic';

const StyledHeader = styled.header`
  display: flex;
  justify-content: space-between;
  margin: ${muiTheme.spacing(1, 2)};
  margin-bottom: 5rem;
`;

interface HeaderProps {
  onClick: () => void;
  isLinkOnly: boolean;
}

const Header: FunctionComponent<HeaderProps> = ({ onClick, isLinkOnly }) => {
  return (
    <StyledHeader>
      <Link
        margin={muiTheme.spacing(1)}
        variant='h6'
        href='https://www.sophie.fi/'
        target='_blank'
        ariaLabel='Visit sophie.fi main page which opens in a new window.'
      >
        sophie.fi
      </Link>
      {!isLinkOnly && <Button onClick={onClick}>Connect Wallet</Button>}
    </StyledHeader>
  );
};

export default Header;
