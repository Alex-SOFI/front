import { FunctionComponent, useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { useIsUserConnected, useMagic } from 'hooks';
import { useDisconnect, useSwitchChain } from 'wagmi';

import routes from 'constants/routes';

import { setIsUserLoading } from 'ducks/user/slice';
import { selectIsWrongNetwork, selectWalletInfo } from 'ducks/wallet';
import { resetMagicLinkAddress } from 'ducks/wallet/slice';

import { copyToClipboard, noop } from 'tools';
import { removeLocalStorageItem } from 'tools/localStorageTools';

import Header from 'components/Header';

interface HeaderContainerProps {
  isLinkOnly?: boolean;
  isMintSelected?: boolean;
  setIsMintSelected?: (state: boolean) => void;
  isTransactionLoading?: boolean;
}

const HeaderContainer: FunctionComponent<HeaderContainerProps> = ({
  isLinkOnly,
  isMintSelected,
  setIsMintSelected,
  isTransactionLoading,
}) => {
  const dispatch = useDispatch();

  const navigate = useNavigate();

  const { disconnectAsync } = useDisconnect();

  const navigateToPage = useCallback(
    (page: string) => {
      if (window.location.pathname !== page) {
        navigate(page);
      }
    },
    [navigate],
  );

  const { address, isConnected, magicLinkAddress } =
    useSelector(selectWalletInfo);
  const isWrongNetwork = useSelector(selectIsWrongNetwork);

  const { userConnectedWithMagicLink, userConnectedWithWallet } =
    useIsUserConnected();

  const walletAddress = useMemo(
    () => (userConnectedWithWallet ? address : magicLinkAddress),
    [address, magicLinkAddress, userConnectedWithWallet],
  );

  const { switchChain } = useSwitchChain();

  const handleSwitchButtonClick = useCallback(() => {
    switchChain({ chainId: Number(import.meta.env.VITE_POLYGON_CHAIN_ID) });
  }, [switchChain]);

  const copyAddress = useCallback(
    () => (walletAddress ? copyToClipboard(walletAddress) : noop),
    [walletAddress],
  );

  const { logoutUser } = useMagic(window.location.pathname);

  const logout = useCallback(async () => {
    await logoutUser();
    dispatch(resetMagicLinkAddress());
  }, [dispatch, logoutUser]);

  const disconnectUser = useCallback(async () => {
    dispatch(setIsUserLoading(true));
    await disconnectAsync();
    dispatch(setIsUserLoading(false));
    removeLocalStorageItem('connectedWithWallet');
    navigate(routes.HOME);
  }, [disconnectAsync, dispatch, navigate]);

  return (
    <Header
      copyAddress={copyAddress}
      isLinkOnly={isLinkOnly || false}
      isConnected={isConnected}
      address={walletAddress}
      handleSwitchButtonClick={handleSwitchButtonClick}
      isWrongNetwork={isWrongNetwork}
      logoutUser={logout}
      navigateToPage={navigateToPage}
      disconnectUser={disconnectUser}
      userConnectedWithMagicLink={userConnectedWithMagicLink}
      isMintSelected={isMintSelected}
      setIsMintSelected={setIsMintSelected}
      isTransactionLoading={isTransactionLoading}
    />
  );
};

export default HeaderContainer;
