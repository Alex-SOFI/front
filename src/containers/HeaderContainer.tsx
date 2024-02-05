import { FunctionComponent, useCallback } from 'react';
import { useSelector } from 'react-redux';

import { useHasWallet, useMagic } from 'hooks';
import { useSwitchChain } from 'wagmi';

import chainIds from 'constants/chainIds';

import { selectIsWrongNetwork, selectWalletInfo } from 'ducks/wallet';

import { copyToClipboard, noop } from 'tools';

import Header from 'components/Header';

interface HeaderContainerProps {
  isLinkOnly?: boolean;
}

const HeaderContainer: FunctionComponent<HeaderContainerProps> = ({
  isLinkOnly,
}) => {
  const { address, isConnected } = useSelector(selectWalletInfo);
  const isWrongNetwork = useSelector(selectIsWrongNetwork);

  const userHasWallet = useHasWallet();

  const { switchChain } = useSwitchChain();

  const handleSwitchButtonClick = useCallback(() => {
    switchChain({ chainId: chainIds.TESTNET });
  }, [switchChain]);

  const copyAddress = useCallback(
    () => (address ? copyToClipboard(address) : noop),
    [address],
  );

  const { logoutUser } = useMagic(window.location.pathname);

  return (
    <Header
      copyAddress={copyAddress}
      isLinkOnly={isLinkOnly || false}
      isConnected={isConnected}
      address={address}
      handleSwitchButtonClick={handleSwitchButtonClick}
      isWrongNetwork={isWrongNetwork}
      userHasWallet={userHasWallet}
      logoutUser={logoutUser}
    />
  );
};

export default HeaderContainer;
