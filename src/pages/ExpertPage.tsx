import {
  ChangeEvent,
  FunctionComponent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useSelector } from 'react-redux';

import { useConnect, useSwitchNetwork } from 'wagmi';
import { readContract } from 'wagmi/actions';

import { Layout } from '../components';
import {
  ExpertPageLinksBlock,
  ExpertPageMain,
} from '../components/pagesComponents/expertPage';
import abi from '../constants/abi';
import addresses from '../constants/addresses';
import chainIds from '../constants/chainIds';
import { selectIsWrongNetwork, selectWalletInfo } from '../ducks/wallet';
import { theme } from '../styles/theme';
import { noop } from '../tools';

const ExpertPage: FunctionComponent = () => {
  const [isMintSelected, setIsMintSelected] = useState<boolean>(true);
  const [USDCInputValue, setUSDCInputValue] = useState<string>('');
  const [SOFIInputValue, setSOFIInputValue] = useState<string | number>('');

  const { connect, connectors } = useConnect();
  const { isConnected, balance, decimals } = useSelector(selectWalletInfo);

  const contractRead = useCallback(
    async (value: string) => {
      const data = await readContract({
        address: addresses.TOKEN_MANAGER,
        abi,
        functionName: 'estimateMint',
        args: [BigInt(Number(value) * Math.pow(10, decimals))],
      });
      return data as bigint;
    },
    [decimals],
  );

  useEffect(() => {
    const timeOutId = setTimeout(async () => {
      if (USDCInputValue) {
        const SOFIValue = await contractRead(
          USDCInputValue === '.' ? '0' : USDCInputValue,
        );

        setSOFIInputValue(Number(SOFIValue) / Math.pow(10, decimals));
      } else {
        setSOFIInputValue('');
      }
    }, 200);
    return () => clearTimeout(timeOutId);
  }, [USDCInputValue, contractRead, decimals]);

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
    async (event: ChangeEvent<HTMLInputElement>) => {
      if (
        (event.target.value.length === 1 && event.target.value === '.') ||
        !isNaN(Number(event.target.value))
      ) {
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
