import { FunctionComponent, useCallback } from 'react';
import { useSelector } from 'react-redux';

import { useConnect } from 'wagmi';

import Header from '../components/Header';
import { selectIsWrongNetwork, selectWalletInfo } from '../ducks/wallet';
import { copyToClipboard, noop } from '../tools';

interface HeaderContainerProps {
  isLinkOnly?: boolean;
}

const HeaderContainer: FunctionComponent<HeaderContainerProps> = ({
  isLinkOnly,
}) => {
  const { connect, connectors } = useConnect();
  const { address, isConnected } = useSelector(selectWalletInfo);
  const isWrongNetwork = useSelector(selectIsWrongNetwork);

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
      isWrongNetwork={isWrongNetwork}
      address={address}
    />
  );
};

export default HeaderContainer;
