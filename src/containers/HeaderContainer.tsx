import { FunctionComponent, useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { useIsUserConnected, useMagic } from 'hooks';
import { useDisconnect, useSwitchChain } from 'wagmi';

import routes from 'constants/routes';

import { selectIsWrongNetwork, selectWalletInfo } from 'ducks/wallet';
import { resetMagicLinkAddress } from 'ducks/wallet/slice';

import { copyToClipboard, noop } from 'tools';
import { removeLocalStorageItem } from 'tools/localStorageTools';

import Header from 'components/Header';

interface HeaderContainerProps {
  isLinkOnly?: boolean;
}

const HeaderContainer: FunctionComponent<HeaderContainerProps> = ({
  isLinkOnly,
}) => {
  const dispatch = useDispatch();

  const navigate = useNavigate();

  const { disconnect } = useDisconnect();

  const navigateToBuyPage = useCallback(() => {
    if (window.location.pathname !== routes.BUY) {
      navigate(routes.BUY);
    }
  }, [navigate]);

  const navigateToTransfertPage = useCallback(() => {
    if (window.location.pathname !== routes.TRANSFERT) {
      navigate(routes.TRANSFERT);
    }
  }, [navigate]);

  const { address, isConnected, magicLinkAddress } =
    useSelector(selectWalletInfo);
  const isWrongNetwork = useSelector(selectIsWrongNetwork);

  const { userConnectedWithWallet } = useIsUserConnected();

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

  const disconnectUser = useCallback(() => {
    disconnect();
    removeLocalStorageItem('connectedWithWallet');
    navigate(routes.HOME);
  }, [disconnect, navigate]);

  return (
    <Header
      copyAddress={copyAddress}
      isLinkOnly={isLinkOnly || false}
      isConnected={isConnected}
      address={walletAddress}
      handleSwitchButtonClick={handleSwitchButtonClick}
      isWrongNetwork={isWrongNetwork}
      logoutUser={logout}
      navigateToBuyPage={navigateToBuyPage}
      navigateToTransfertPage={navigateToTransfertPage}
      disconnectUser={disconnectUser}
    />
  );
};

export default HeaderContainer;
