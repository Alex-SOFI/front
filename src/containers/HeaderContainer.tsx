import { FunctionComponent, useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { useIsUserConnected, useMagic } from 'hooks';
import { useSwitchChain } from 'wagmi';

import chainIds from 'constants/chainIds';
import routes from 'constants/routes';

import { selectIsWrongNetwork, selectWalletInfo } from 'ducks/wallet';
import { resetMagicLinkAddress } from 'ducks/wallet/slice';

import { copyToClipboard, noop } from 'tools';

import Header from 'components/Header';

interface HeaderContainerProps {
  isLinkOnly?: boolean;
}

const HeaderContainer: FunctionComponent<HeaderContainerProps> = ({
  isLinkOnly,
}) => {
  const dispatch = useDispatch();

  const navigate = useNavigate();

  const navigateToBuyPage = useCallback(() => {
    if (window.location.pathname !== routes.BUY) {
      navigate(routes.BUY);
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
    switchChain({ chainId: chainIds.TESTNET });
  }, [switchChain]);

  const copyAddress = useCallback(
    () => (walletAddress ? copyToClipboard(walletAddress) : noop),
    [walletAddress],
  );

  const { logoutUser } = useMagic(window.location.pathname);

  const logout = useCallback(async () => {
    await logoutUser();
    dispatch(resetMagicLinkAddress());
    localStorage.removeItem('hasWallet');
  }, [dispatch, logoutUser]);

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
    />
  );
};

export default HeaderContainer;
