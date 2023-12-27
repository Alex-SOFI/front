import { FunctionComponent, useCallback } from 'react';
import { useSelector } from 'react-redux';

import { useConnect, useSwitchNetwork } from 'wagmi';

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
  const { connect, connectors } = useConnect();
  const { address, isConnected } = useSelector(selectWalletInfo);
  const isWrongNetwork = useSelector(selectIsWrongNetwork);

  const { switchNetwork } = useSwitchNetwork({
    throwForSwitchChainNotSupported: true,
    chainId: chainIds.TESTNET,
  });

  const copyAddress = useCallback(
    () => (address ? copyToClipboard(address) : noop),
    [address],
  );

  return (
    <Header
      handleConnectButtonClick={() => connect({ connector: connectors[0] })}
      copyAddress={copyAddress}
      isLinkOnly={isLinkOnly || false}
      isConnected={isConnected}
      address={address}
      handleSwitchButtonClick={switchNetwork || noop}
      isWrongNetwork={isWrongNetwork}
    />
  );
};

export default HeaderContainer;
