import {
  ChangeEvent,
  FunctionComponent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useSelector } from 'react-redux';

import {
  erc20ABI,
  useConnect,
  useContractWrite,
  useSwitchNetwork,
} from 'wagmi';
import { readContract } from 'wagmi/actions';

import addresses from 'constants/addresses';
import chainIds from 'constants/chainIds';
import errorTexts from 'constants/errorTexts';
import SOFIabi from 'constants/sofiAbi';

import { selectIsWrongNetwork, selectWalletInfo } from 'ducks/wallet';

import { noop, pow } from 'tools';

import {
  ExpertPageLinksBlock,
  ExpertPageMain,
} from 'components/pagesComponents/expertPage';

import { Layout } from 'components';

import { theme } from 'styles/theme';

const ExpertPage: FunctionComponent = () => {
  const [isMintSelected, setIsMintSelected] = useState<boolean>(true);
  const [USDCInputValue, setUSDCInputValue] = useState<string>('');
  const [SOFIInputValue, setSOFIInputValue] = useState<string | number>('');

  const [isMaxValueError, setIsMaxValueError] = useState<boolean>(false);

  const { connect, connectors } = useConnect();
  const { address, isConnected, balance, decimals, chainId } =
    useSelector(selectWalletInfo);

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

  const estimateMint = useCallback(
    async (value: string) => {
      /* console.log(pow(value, decimals), BigInt(pow(value, decimals))); */
      const data = await readContract({
        address: addresses.TOKEN_MANAGER,
        abi: SOFIabi,
        functionName: 'estimateMint',
        args: [pow(value, decimals)],
      });
      return data as bigint;
    },
    [decimals],
  );

  useEffect(() => {
    const timeOutId = setTimeout(async () => {
      if (!isMaxValueError && USDCValue) {
        const SOFIValue = await estimateMint(USDCValue);

        setSOFIInputValue(
          Number(SOFIValue) / 10 ** (decimals / 2) / 10 ** (decimals / 2),
        );
      } else {
        setSOFIInputValue('');
      }
    }, 200);
    return () => clearTimeout(timeOutId);
  }, [USDCValue, estimateMint, decimals, balance, isMaxValueError]);

  const isWrongNetwork = useSelector(selectIsWrongNetwork);

  const tokenAddress = useMemo(
    () =>
      chainId === chainIds.TESTNET ? addresses.USDC_MUMBAI : addresses.USDC,
    [chainId],
  );

  const {
    isLoading: isApproveLoading,
    isSuccess: isApproveSuccess,
    write,
  } = useContractWrite({
    address: tokenAddress,
    abi: erc20ABI,
    functionName: 'approve',
  });

  const approveToken = useCallback(() => {
    if (address) {
      write({
        args: [address, BigInt(pow(USDCValue, decimals))],
      });
    }
  }, [USDCValue, address, decimals, write]);

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
          isMaxValueError={isMaxValueError}
          status={status}
          handleConnectButtonClick={handleConnectButtonClick}
          isMintSelected={isMintSelected}
          setIsMintSelected={setIsMintSelected}
          USDCInputValue={USDCInputValue}
          handleUSDCInputValueChange={handleUSDCInputValueChange}
          SOFIInputValue={SOFIInputValue}
          setSOFIInputValue={setSOFIInputValue}
          handleSwitchButtonClick={switchNetwork || noop}
          approveToken={approveToken}
          isApproveSuccess={isApproveSuccess}
          isApproveLoading={isApproveLoading}
        />
      }
      footer={<ExpertPageLinksBlock />}
    />
  );
};

export default ExpertPage;
