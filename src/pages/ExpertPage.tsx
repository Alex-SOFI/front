import {
  FunctionComponent,
  KeyboardEvent,
  useCallback,
  useMemo,
  useState,
} from 'react';
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

  const [isDotEntered, setIsDotEntered] = useState(false);
  const handleUSDCInputKeyDown = useCallback(
    (event: KeyboardEvent<HTMLInputElement>) => {
      if (event.key === '.' && !isDotEntered) {
        setIsDotEntered(true);
      }
      if (event.key === '.' && isDotEntered) {
        event.preventDefault();
      }
      if (
        isNaN(Number(event.key)) &&
        event.key !== 'Backspace' &&
        event.key !== '.'
      ) {
        event.preventDefault();
      }
    },
    [isDotEntered],
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
          isMintSelected={isMintSelected}
          setIsMintSelected={setIsMintSelected}
          USDCInputValue={USDCInputValue}
          setUSDCInputValue={setUSDCInputValue}
          SOFIInputValue={SOFIInputValue}
          setSOFIInputValue={setSOFIInputValue}
          handleUSDCInputKeyDown={handleUSDCInputKeyDown}
        />
      }
      footer={<ExpertPageLinksBlock />}
    />
  );
};

export default ExpertPage;
