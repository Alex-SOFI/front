import { FunctionComponent } from 'react';

import styled from '@emotion/styled';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import Box from '@mui/material/Box';

/* import { useDisconnect } from 'wagmi'; */
import { Button, Picture, Text } from '../components/basic';
import { PUBLIC_URL } from '../config';
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
  isConnected: boolean;
  isWrongNetwork: boolean;
  address?: string;
}

const Header: FunctionComponent<HeaderProps> = ({
  onClick,
  isLinkOnly,
  isConnected,
  isWrongNetwork,
  address,
}) => {
  /* const { disconnect } = useDisconnect(); */

  return (
    <StyledHeader>
      <Link
        href='https://www.sophie.fi/'
        ariaLabel='Visit sophie.fi main page which opens in a new window.'
      >
        sophie.fi
      </Link>
      {!isLinkOnly && (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Picture
            src={`${PUBLIC_URL}/icons/logo_polygon.svg`}
            alt='Polygon logo'
            width={40}
            height={40}
            marginRight='1rem'
          />
          {isConnected && !isWrongNetwork ? (
            <Box
              sx={{ maxWidth: '10rem', display: 'flex', alignItems: 'center' }}
            >
              <Text
                sx={{
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                }}
                variant='h1'
              >
                {address}
              </Text>
              <ContentCopyIcon
                sx={{
                  marginLeft: '1rem',
                  marginRight: '0.5rem',
                  fontSize: '30px',
                }}
              />
            </Box>
          ) : (
            <Button onClick={onClick /* disconnect */}>Connect Wallet</Button>
          )}
        </Box>
      )}
    </StyledHeader>
  );
};

export default Header;
