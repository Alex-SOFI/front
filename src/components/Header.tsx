import { FunctionComponent } from 'react';

import styled from '@emotion/styled';
import { useDisconnect } from 'wagmi';

import { Button } from '../components/basic';
import { muiTheme } from '../styles/globalStyle';
import { Link } from './basic';

const StyledHeader = styled.header`
  display: flex;
  justify-content: space-between;
  margin-bottom: 5rem;
  padding: ${muiTheme.spacing(1)};
`;

interface HeaderProps {
  onClick: () => void;
  isLinkOnly: boolean;
}

const Header: FunctionComponent<HeaderProps> = ({ onClick, isLinkOnly }) => {
  const { disconnect } = useDisconnect();

  return (
    <StyledHeader>
      <Link
        href='https://www.sophie.fi/'
        ariaLabel='Visit sophie.fi main page which opens in a new window.'
      >
        sophie.fi
      </Link>
      {!isLinkOnly && (
        <Button onClick={/* onClick */ disconnect}>Connect Wallet</Button>
      )}
    </StyledHeader>
  );
};

export default Header;
