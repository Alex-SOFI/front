import { FunctionComponent, useCallback, useMemo } from 'react';

import styled from '@emotion/styled';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import LogoutIcon from '@mui/icons-material/Logout';
import Box from '@mui/material/Box';
import { useWeb3Modal } from '@web3modal/wagmi/react';
import { PUBLIC_URL } from 'config';

import routes from 'constants/routes';

import { Button, ButtonWithIcon, Picture, Text } from 'components/basic';

import { muiTheme } from 'styles/globalStyle';
import { theme } from 'styles/theme';

const StyledHeader = styled.header`
  display: flex;
  flex-direction: column;
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
  navigateToPage: (page: string) => void;
  disconnectUser: () => void;
  userConnectedWithMagicLink: boolean | null;
  isMintSelected?: boolean;
  setIsMintSelected?: (state: boolean) => void;
  isTransactionLoading?: boolean;
}

const Header: FunctionComponent<HeaderProps> = ({
  copyAddress,
  isLinkOnly,
  isConnected,
  address,
  handleSwitchButtonClick,
  isWrongNetwork,
  logoutUser,
  disconnectUser,
  userConnectedWithMagicLink,
  navigateToPage,
  isMintSelected,
  setIsMintSelected,
  isTransactionLoading,
}) => {
  const { open } = useWeb3Modal();

  const isExpertPage = useMemo(
    () => window.location.pathname === routes.EXPERT,
    [],
  );

  const addressButton = useMemo(
    () => (
      <Button onClick={copyAddress} variant='text' maxWidth='10rem'>
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
        onClick={isExpertPage ? disconnectUser : logoutUser}
        maxHeight='2.719rem'
        color='black'
        ariaLabel='disconnect'
      >
        <LogoutIcon aria-label='disconnect' fontSize='large' />
      </ButtonWithIcon>
    ),
    [disconnectUser, isExpertPage, logoutUser],
  );

  const render = useCallback(() => {
    if (isLinkOnly) {
      return null;
    } else {
      if (isExpertPage) {
        return (
          <>
            <Picture
              src={`${PUBLIC_URL}/icons/logo_arb.svg`}
              alt='Arbitrum logo'
              width={40}
              height={40}
              marginRight='1rem'
            />
            {isConnected ? (
              isWrongNetwork ? (
                <>
                  <Button
                    onClick={() => handleSwitchButtonClick()}
                    width='10rem'
                    padding='0px'
                  >
                    Switch Network
                  </Button>
                </>
              ) : (
                <Box display='flex' maxWidth='10rem'>
                  {addressButton}
                  {disconnectButton}
                </Box>
              )
            ) : (
              <Button onClick={() => open()} minWidth='10rem'>
                Connect Wallet
              </Button>
            )}
          </>
        );
      } else {
        return (
          <>
            {addressButton}
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
    isExpertPage,
    isLinkOnly,
    isWrongNetwork,
    open,
  ]);

  return (
    <StyledHeader>
      <Box display='flex' justifyContent='space-between' width='100%'>
        <Box display='flex' alignItems='center'>
          <Button
            variant='text'
            onClick={
              userConnectedWithMagicLink
                ? () => navigateToPage(routes.MAIN)
                : () => navigateToPage(routes.HOME)
            }
            minWidth={'0'}
          >
            <Picture
              src={`${PUBLIC_URL}/icons/logo_sophie.png`}
              alt='SOPHIE logo'
              width={40}
              height={40}
            />
          </Button>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>{render()}</Box>
      </Box>
      {!isLinkOnly &&
        (isExpertPage ? (
          <Box
            sx={{
              display: 'flex',
              gridTemplateColumns: 'repeat(2, 1fr)',
              maxWidth: theme.breakpoints.sm,
              width: '100%',
              margin: '5dvh auto 0 auto',
            }}
          >
            <Button
              isPrimaryColor={isMintSelected}
              onClick={() => setIsMintSelected!(true)}
              disabled={isTransactionLoading}
              variant='text'
              fullWidth
            >
              Mint
            </Button>
            <Button
              isPrimaryColor={!isMintSelected}
              onClick={() => setIsMintSelected!(false)}
              disabled={isTransactionLoading}
              variant='text'
              fullWidth
            >
              Redeem
            </Button>
          </Box>
        ) : (
          <Box display='flex' justifyContent='center' mt='5dvh'>
            <Button
              onClick={() => navigateToPage(routes.BUY)}
              marginRight='2dvh'
            >
              Buy SOPHIE
            </Button>
            <Button
              onClick={() => navigateToPage(routes.TRANSFERT)}
              variant='outlined'
              isPrimaryColor
            >
              Transfert
            </Button>
          </Box>
        ))}
    </StyledHeader>
  );
};

export default Header;
