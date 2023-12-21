import {
  ChangeEvent,
  FunctionComponent,
  useCallback,
  useMemo,
  useState,
} from 'react';
import { useSelector } from 'react-redux';

import { useConnect, useSwitchNetwork } from 'wagmi';

import { Layout } from '../components';
import {
  ExpertPageLinksBlock,
  ExpertPageMain,
} from '../components/pagesComponents/expertPage';
import chainIds from '../constants/chainIds';
import { selectIsWrongNetwork, selectWalletInfo } from '../ducks/wallet';
import { theme } from '../styles/theme';
import { noop } from '../tools';

const ExpertPage: FunctionComponent = () => {
  const [isMintSelected, setIsMintSelected] = useState<boolean>(true);
  const [USDCInputValue, setUSDCInputValue] = useState<string>('');
  const [SOFIInputValue, setSOFIInputValue] = useState<string>('');

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

  const handleUSDCInputValueChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      if (!isNaN(Number(event.target.value))) {
        setUSDCInputValue(event.target.value);
      }
    },
    [],
  );

  const { switchNetwork } = useSwitchNetwork({
    throwForSwitchChainNotSupported: true,
    chainId: chainIds.TESTNET,
  });

  return (
    <Layout
      main={
        <ExpertPageMain
          isConnected={isConnected}
          balance={balance}
          isWrongNetwork={isWrongNetwork}
          statusText={statusText}
          handleConnectButtonClick={handleConnectButtonClick}
          isMintSelected={isMintSelected}
          setIsMintSelected={setIsMintSelected}
          USDCInputValue={USDCInputValue}
          handleUSDCInputValueChange={handleUSDCInputValueChange}
          SOFIInputValue={SOFIInputValue}
          setSOFIInputValue={setSOFIInputValue}
          handleSwitchButtonClick={switchNetwork || noop}
        />
      }
      footer={<ExpertPageLinksBlock />}
    />
  );
};

export default ExpertPage;
