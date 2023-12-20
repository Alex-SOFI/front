import { FunctionComponent, useCallback, useMemo } from 'react';
import { useSelector } from 'react-redux';

import { useConnect } from 'wagmi';

import { Layout } from '../components';
import {
  ExpertPageLinksBlock,
  ExpertPageMain,
} from '../components/pagesComponents/expertPage';
import { selectIsWrongNetwork, selectWalletInfo } from '../ducks/wallet';
import { theme } from '../styles/theme';

const ExpertPage: FunctionComponent = () => {
  const { connect, connectors } = useConnect();

  const { isConnected, balance } = useSelector(selectWalletInfo);

  const isWrongNetwork = useSelector(selectIsWrongNetwork);

  const statusText = useMemo(() => {
    switch (true) {
      case isWrongNetwork:
        return {
          color: theme.colors.error,
          text: 'Unsupported network detected, switch to Polygon to continue.',
        };

      default:
        return null;
    }
  }, [isWrongNetwork]);

  const handleConnectButtonClick = useCallback(
    () => connect({ connector: connectors[0] }),
    [connect, connectors],
  );

  return (
    <Layout
      main={
        <ExpertPageMain
          isConnected={isConnected}
          balance={balance}
          isWrongNetwork={isWrongNetwork}
          statusText={statusText}
          handleConnectButtonClick={handleConnectButtonClick}
        />
      }
      footer={<ExpertPageLinksBlock />}
    />
  );
};

export default ExpertPage;
