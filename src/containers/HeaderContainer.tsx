import { FunctionComponent } from 'react';
import { useSelector } from 'react-redux';

import { useConnect } from 'wagmi';

import Header from '../components/Header';
import { selectIsWrongNetwork, selectWalletInfo } from '../ducks/wallet';

interface HeaderContainerProps {
  isLinkOnly?: boolean;
}

const HeaderContainer: FunctionComponent<HeaderContainerProps> = ({
  isLinkOnly,
}) => {
  const { connect, connectors } = useConnect();
  const { address, isConnected } = useSelector(selectWalletInfo);
  const isWrongNetwork = useSelector(selectIsWrongNetwork);

  return (
    <Header
      onClick={() => connect({ connector: connectors[0] })}
      isLinkOnly={isLinkOnly || false}
      isConnected={isConnected}
      isWrongNetwork={isWrongNetwork}
      address={address}
    />
  );
};

export default HeaderContainer;
