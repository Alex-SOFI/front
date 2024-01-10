import {
  ChangeEvent,
  FunctionComponent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useSelector } from 'react-redux';

import { erc20Abi } from 'viem';
import {
  useConnect,
  useSwitchChain,
  useWatchContractEvent,
  useWriteContract,
} from 'wagmi';
import { readContract } from 'wagmi/actions';

import wagmiConfig from 'configs/wagmiConfig';

import addresses from 'constants/addresses';
import chainIds from 'constants/chainIds';
import SOFIabi from 'constants/sofiAbi';
import statusTexts from 'constants/statusTexts';

import { selectIsWrongNetwork, selectWalletInfo } from 'ducks/wallet';

import { formatBalance, pow } from 'tools';

import {
  ExpertPageLinksBlock,
  ExpertPageMain,
} from 'components/pagesComponents/expertPage';

import { Layout } from 'components';

import { theme } from 'styles/theme';

const ExpertPage: FunctionComponent = () => {
  const [isMintSelected, setIsMintSelected] = useState<boolean>(true);
  const [activeInputValue, setActiveInputValue] = useState<string>('');
  const [calculatedInputValue, setCalculatedInputValue] = useState<string>('');

  const [isMaxValueError, setIsMaxValueError] = useState<boolean>(false);

  const { connect, connectors } = useConnect();
  const { address, isConnected, balance, decimals, chainId } =
    useSelector(selectWalletInfo);

  const { switchChain } = useSwitchChain();

  const isWrongNetwork = useSelector(selectIsWrongNetwork);

  const tokenAddress = useMemo(
    () =>
      chainId === chainIds.TESTNET ? addresses.USDC_MUMBAI : addresses.USDC,
    [chainId],
  );

  const { isPending, isSuccess, writeContract } = useWriteContract();

  const [isApproveSuccess, setIsApproveSuccess] = useState<boolean>(false);
  const [isApproveLoading, setIsApproveLoading] = useState<boolean>(false);

  useWatchContractEvent({
    address: tokenAddress,
    abi: erc20Abi,
    eventName: 'Approval',
    onLogs(logs) {
      // eslint-disable-next-line no-console
      console.log(logs);
      setIsApproveSuccess(true);
      setIsApproveLoading(false);
    },
  });

  const activeValue = useMemo(
    () => (activeInputValue === '.' ? '0' : activeInputValue),
    [activeInputValue],
  );

  useEffect(() => {
    if (Number(activeValue) > Number(balance)) {
      setIsMaxValueError(true);
    } else {
      setIsMaxValueError(false);
    }
  }, [activeValue, balance]);

  const estimateMint = useCallback(
    async (value: string) => {
      const data = await readContract(wagmiConfig, {
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
      if (!isMaxValueError && activeValue) {
        const SOFIValue = await estimateMint(activeValue);

        // temporary
        const [, fractionalPart] = activeValue.split('.');
        const fractionalPartLength = fractionalPart?.length || 0;

        const value = (
          SOFIValue / BigInt(10 ** (decimals - fractionalPartLength))
        ).toString();

        setCalculatedInputValue(
          fractionalPart
            ? value.slice(0, value.length - fractionalPartLength) +
                '.' +
                value.slice(value.length - fractionalPartLength)
            : value,
        );
      } else {
        setCalculatedInputValue('');
      }
    }, 200);
    return () => clearTimeout(timeOutId);
  }, [activeValue, estimateMint, decimals, balance, isMaxValueError]);

  const approveToken = useCallback(() => {
    setIsApproveLoading(true);
    if (address) {
      writeContract({
        address: tokenAddress,
        abi: erc20Abi,
        functionName: 'approve',
        args: [address, pow(activeValue, decimals)],
      });
    }
  }, [activeValue, address, decimals, tokenAddress, writeContract]);

  const mintSOFI = useCallback(() => {
    if (address && calculatedInputValue) {
      const a = writeContract({
        address: addresses.TOKEN_MANAGER,
        abi: SOFIabi,
        functionName: 'mint',
        args: [pow(calculatedInputValue, decimals)],
      });
      console.log(a);
    }
  }, [calculatedInputValue, address, decimals, writeContract]);

  const status = useMemo(() => {
    switch (true) {
      case isWrongNetwork:
        return {
          color: theme.colors.error,
          text: statusTexts.UNSUPPORTED_NETWORK,
          error: true,
        };

      case isMaxValueError:
        return {
          color: theme.colors.error,
          text: statusTexts.MAX_VALUE,
          error: true,
        };

      /* case isMintLoading:
        return {
          color: theme.colors.info,
          text: statusTexts.MINT_LOADING,
          error: false,
        };

      case isMintFailed:
        return {
          color: theme.colors.error,
          text: statusTexts.MINT_FAILED,
          error: true,
        };

      case isMintSuccessful:
        return {
          color: theme.colors.success,
          text: statusTexts.MINT_SUCCESSFUL,
          error: false,
        }; */

      default:
        return null;
    }
  }, [isMaxValueError, isWrongNetwork]);

  const handleConnectButtonClick = useCallback(
    () => connect({ connector: connectors[0] }),
    [connect, connectors],
  );

  const handleActiveInputValueChange = useCallback(
    async (event: ChangeEvent<HTMLInputElement>) => {
      if (
        (event.target.value.length === 1 && event.target.value === '.') ||
        !isNaN(Number(event.target.value))
      ) {
        const float = event.target.value.split('.')?.[1];
        if (!float || (float && float?.length <= decimals)) {
          setActiveInputValue(event.target.value);
        }
      }
    },
    [decimals],
  );

  const handleSwitchButtonClick = useCallback(() => {
    switchChain({ chainId: chainIds.TESTNET });
  }, [switchChain]);

  return (
    <Layout
      main={
        <ExpertPageMain
          isConnected={isConnected}
          balance={formatBalance(balance, 3)}
          isWrongNetwork={isWrongNetwork}
          isMaxValueError={isMaxValueError}
          status={status}
          handleConnectButtonClick={handleConnectButtonClick}
          isMintSelected={isMintSelected}
          setIsMintSelected={setIsMintSelected}
          activeInputValue={activeInputValue}
          handleActiveInputValueChange={handleActiveInputValueChange}
          calculatedInputValue={calculatedInputValue}
          setCalculatedInputValue={setCalculatedInputValue}
          handleSwitchButtonClick={handleSwitchButtonClick}
          approveToken={approveToken}
          isApproveSuccess={isApproveSuccess}
          isApproveLoading={isApproveLoading}
          mintSOFI={mintSOFI}
        />
      }
      footer={<ExpertPageLinksBlock />}
    />
  );
};

export default ExpertPage;
