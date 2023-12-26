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
import { SOFIabi } from '../constants/abis';
import addresses from '../constants/addresses';
import chainIds from '../constants/chainIds';
import errorTexts from '../constants/errorTexts';
import { selectIsWrongNetwork, selectWalletInfo } from '../ducks/wallet';
import { theme } from '../styles/theme';
import { noop } from '../tools';

const ExpertPage: FunctionComponent = () => {
  const [isMintSelected, setIsMintSelected] = useState<boolean>(true);
  const [USDCInputValue, setUSDCInputValue] = useState<string>('');
  const [SOFIInputValue, setSOFIInputValue] = useState<string | number>('');

  const [isMaxValueError, setIsMaxValueError] = useState<boolean>(false);

  const { connect, connectors } = useConnect();
  const { isConnected, balance, decimals } = useSelector(selectWalletInfo);

  const estimateMint = useCallback(
    async (value: string) => {
      const data = await readContract({
        address: addresses.TOKEN_MANAGER,
        abi: SOFIabi,
        functionName: 'estimateMint',
        args: [BigInt(Number(value) * Math.pow(10, decimals))],
      });
      return data as bigint;
    },
    [decimals],
  );

  const USDCValue = useMemo(
    () => (USDCInputValue === '.' ? '0' : USDCInputValue),
    [USDCInputValue],
  );

  useEffect(() => {
    if (Number(USDCValue) > Number(balance)) {
      setIsMaxValueError(true);
    } else {
      setIsMaxValueError(false);
    }
  }, [USDCValue, balance]);

  useEffect(() => {
    const timeOutId = setTimeout(async () => {
      if (!isMaxValueError && USDCValue) {
        const SOFIValue = await estimateMint(USDCValue);

        setSOFIInputValue(Number(SOFIValue) / Math.pow(10, decimals));
      } else {
        setSOFIInputValue('');
      }
    }, 200);
    return () => clearTimeout(timeOutId);
  }, [USDCValue, estimateMint, decimals, balance, isMaxValueError]);

  const isWrongNetwork = useSelector(selectIsWrongNetwork);

  const status = useMemo(() => {
    switch (true) {
      case isWrongNetwork:
        return {
          color: theme.colors.error,
          text: errorTexts.UNSUPPORTED_NETWORK,
          error: true,
        };

      case isMaxValueError:
        return {
          color: theme.colors.error,
          text: errorTexts.MAX_VALUE,
          error: true,
        };

      default:
        return null;
    }
  }, [isMaxValueError, isWrongNetwork]);

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
          status={status}
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
