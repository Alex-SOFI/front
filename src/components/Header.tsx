import { FunctionComponent, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

import styled from '@emotion/styled';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import LogoutIcon from '@mui/icons-material/Logout';
import Box from '@mui/material/Box';
import { useWeb3Modal } from '@web3modal/wagmi/react';
import { PUBLIC_URL } from 'config';
import { useDisconnect } from 'wagmi';

import routes from 'constants/routes';

import { noop } from 'tools';
import { removeLocalStorageItem } from 'tools/localStorageTools';

import { Button, ButtonWithIcon, Link, Picture, Text } from 'components/basic';

import { muiTheme } from 'styles/globalStyle';
import { theme } from 'styles/theme';

const StyledHeader = styled.header`
  display: flex;
  justify-content: space-between;
  margin-bottom: 5rem;
  padding: ${muiTheme.spacing(1)};

  @media (max-width: ${theme.breakpoints.sm}) {
    margin-bottom: clamp(0rem, 1dvh, 5rem);
  }
`;

interface HeaderProps {
  copyAddress: () => void;
  isLinkOnly: boolean;
  isConnected: boolean;
  address?: string;
  handleSwitchButtonClick: (chainId_?: number | undefined) => void;
  isWrongNetwork: boolean;
  logoutUser: () => Promise<void>;
}

const Header: FunctionComponent<HeaderProps> = ({
  copyAddress,
  isLinkOnly,
  isConnected,
  address,
  handleSwitchButtonClick,
  isWrongNetwork,
  logoutUser,
}) => {
  const { disconnect } = useDisconnect();
  const { open } = useWeb3Modal();
  const navigate = useNavigate();

  const disconnectUser = useCallback(() => {
    disconnect();
    removeLocalStorageItem('connectedWithWallet');
    navigate(routes.HOME);
  }, [disconnect, navigate]);

  const addressButton = useMemo(
    () => (
      <Button onClick={copyAddress} variant='text' maxWidth='11rem'>
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
            fontSize: '30px',
          }}
        />
      </Button>
    ),
    [address, copyAddress],
  );

  const disconnectButton = useMemo(
    () => (
      <ButtonWithIcon
        onClick={
          window.location.pathname === routes.EXPERT
            ? disconnectUser
            : logoutUser
        }
        maxHeight='2.719rem'
        color='black'
        ariaLabel='disconnect'
      >
        <LogoutIcon aria-label='disconnect' fontSize='large' />
      </ButtonWithIcon>
    ),
    [disconnectUser, logoutUser],
  );

  const render = useCallback(() => {
    if (isLinkOnly) {
      return null;
    } else {
      if (window.location.pathname === routes.EXPERT) {
        return (
          <>
            <Picture
              src={`${PUBLIC_URL}/icons/logo_polygon.svg`}
              alt='Polygon logo'
              width={40}
              height={40}
              marginRight='1rem'
            />
            {isConnected ? (
              isWrongNetwork ? (
                <>
                  <Button
                    onClick={() => handleSwitchButtonClick()}
                    minWidth='11rem'
                  >
                    Switch Network
                  </Button>
                </>
              ) : (
                <Box display='flex' maxWidth='11rem'>
                  {addressButton}
                  {disconnectButton}
                </Box>
              )
            ) : (
              <Button onClick={() => open()} minWidth='11rem'>
                Connect Wallet
              </Button>
            )}
          </>
        );
      } else {
        return (
          <>
            {addressButton}
            <Button onClick={noop}>Buy SOFI</Button>
            {disconnectButton}
          </>
        );
      }
    }
  }, [
    addressButton,
    disconnectButton,
    handleSwitchButtonClick,
    isConnected,
    isLinkOnly,
    isWrongNetwork,
    open,
  ]);

  return (
    <StyledHeader>
      <Box display='flex' alignItems='center'>
        <Link
          href='https://www.sophie.fi/'
          ariaLabel='Visit sophie.fi main page which opens in a new window.'
        >
          sophie.fi
        </Link>
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>{render()}</Box>
    </StyledHeader>
  );
};

export default Header;
