import { FunctionComponent, useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { useHasWallet, useMagic } from 'hooks';
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

  const userHasWallet = useHasWallet();

  const walletAddress = useMemo(
    () => (userHasWallet ? address : magicLinkAddress),
    [address, magicLinkAddress, userHasWallet],
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
  }, [dispatch, logoutUser]);

  return (
    <Header
      copyAddress={copyAddress}
      isLinkOnly={isLinkOnly || false}
      isConnected={isConnected}
      address={walletAddress}
      handleSwitchButtonClick={handleSwitchButtonClick}
      isWrongNetwork={isWrongNetwork}
      userHasWallet={userHasWallet}
      logoutUser={logout}
      navigateToBuyPage={navigateToBuyPage}
    />
  );
};

export default HeaderContainer;
