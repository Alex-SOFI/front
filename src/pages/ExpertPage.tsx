import {
  ChangeEvent,
  FunctionComponent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useSelector } from 'react-redux';

import { QueryObserverResult, RefetchOptions } from '@tanstack/react-query';
import { formatUnits, parseUnits } from 'ethers';
import { Address, erc20Abi } from 'viem';
import {
  useConnect,
  useReadContract,
  useSwitchChain,
  useWaitForTransactionReceipt,
  useWriteContract,
} from 'wagmi';
import { ReadContractsErrorType, readContract } from 'wagmi/actions';

import wagmiConfig from 'configs/wagmiConfig';

import addresses from 'constants/addresses';
import chainIds from 'constants/chainIds';
import SOFIabi from 'constants/sofiAbi';
import statusTexts from 'constants/statusTexts';

import { selectIsWrongNetwork, selectWalletInfo } from 'ducks/wallet';

import { formatBalance } from 'tools';

import {
  ExpertPageLinksBlock,
  ExpertPageMain,
} from 'components/pagesComponents/expertPage';

import { Layout } from 'components';

import { theme } from 'styles/theme';

interface ExpertPageProps {
  tokenAddress: Address;
  refetchBalance: (
    options?: RefetchOptions | undefined,
  ) => Promise<
    QueryObserverResult<[bigint, number, string], ReadContractsErrorType>
  >;
}

const ExpertPage: FunctionComponent<ExpertPageProps> = ({
  tokenAddress,
  refetchBalance,
}) => {
  const [isMintSelected, setIsMintSelected] = useState<boolean>(true);
  const [activeInputValue, setActiveInputValue] = useState<string>('');
  const [calculatedInputValue, setCalculatedInputValue] = useState<string>('');

  const [isMaxValueError, setIsMaxValueError] = useState<boolean>(false);

  const { connect, connectors } = useConnect();
  const { address, isConnected, balance, decimals } =
    useSelector(selectWalletInfo);

  const { switchChain } = useSwitchChain();

  const isWrongNetwork = useSelector(selectIsWrongNetwork);

  const [hash, setHash] = useState<Address>();

  const [isApproveButtonVisible, setIsApproveButtonVisible] =
    useState<boolean>(false);
  const [isApproveButtonClicked, setIsApproveButtonClicked] =
    useState<boolean>(false);

  const {
    /* data: transactionData, */
    isLoading: isTransactionLoading,
    isError: isTransactionError,
    isSuccess: isTransactionSuccess,
  } = useWaitForTransactionReceipt({
    hash,
  });

  useEffect(() => {
    if (isTransactionSuccess) {
      refetchBalance();
    }
  }, [isTransactionSuccess, refetchBalance]);

  const { data: allowance, refetch: refetchAllowance } = useReadContract({
    address: tokenAddress,
    abi: erc20Abi,
    functionName: 'allowance',
    args: [address, addresses.TOKEN_MANAGER],
  });

  useEffect(() => {
    if (allowance) {
      if (Number(activeInputValue) > Number(formatUnits(allowance, decimals))) {
        setIsApproveButtonVisible(true);
      } else {
        setIsApproveButtonVisible(false);
      }
    }
    if (allowance === 0n) {
      setIsApproveButtonVisible(true);
    }
    if (isApproveButtonClicked && isTransactionSuccess) {
      refetchAllowance();
      setIsApproveButtonVisible(false);
    }
  }, [
    address,
    tokenAddress,
    activeInputValue,
    decimals,
    allowance,
    isTransactionSuccess,
    refetchAllowance,
    isApproveButtonClicked,
  ]);

  const {
    isPending,
    /* isSuccess, */
    writeContract,
    writeContractAsync,
    isError,
    data,
  } = useWriteContract();

  const activeValue = useMemo(
    () => (activeInputValue === '.' ? '0' : activeInputValue),
    [activeInputValue],
  );

  useEffect(() => {
    if (data) {
      setHash(data);
    }
  }, [data]);

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
        args: [parseUnits(value, decimals)],
      });
      return data as bigint;
    },
    [decimals],
  );

  useEffect(() => {
    const timeOutId = setTimeout(async () => {
      if (!isMaxValueError && activeValue) {
        const SOFIValue = await estimateMint(activeValue);

        setCalculatedInputValue(formatUnits(SOFIValue, decimals));
      } else {
        setCalculatedInputValue('');
      }
    }, 200);
    return () => clearTimeout(timeOutId);
  }, [activeValue, estimateMint, decimals, balance, isMaxValueError]);

  const approveToken = useCallback(async () => {
    if (address) {
      setIsApproveButtonClicked(true);
      writeContract({
        address: tokenAddress,
        abi: erc20Abi,
        functionName: 'approve',
        args: [addresses.TOKEN_MANAGER, parseUnits(activeValue, decimals)],
      });
    }
  }, [activeValue, address, decimals, tokenAddress, writeContract]);

  const mintSOFI = useCallback(async () => {
    if (address && calculatedInputValue) {
      setIsApproveButtonClicked(false);
      await writeContractAsync({
        address: addresses.TOKEN_MANAGER,
        abi: SOFIabi,
        functionName: 'mint',
        args: [parseUnits(calculatedInputValue, decimals)],
      });
    }
  }, [address, calculatedInputValue, writeContractAsync, decimals]);

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

      case !isApproveButtonVisible && (isPending || isTransactionLoading):
        return {
          color: theme.colors.info,
          text: statusTexts.MINT_LOADING,
          error: false,
        };

      case !isApproveButtonVisible && (isError || isTransactionError):
        return {
          color: theme.colors.error,
          text: statusTexts.MINT_FAILED,
          error: false,
        };

      case !isApproveButtonClicked && isTransactionSuccess:
        setCalculatedInputValue('');
        return {
          color: theme.colors.success,
          text: statusTexts.MINT_SUCCESSFUL,
          error: false,
        };

      case isTransactionError:
        return {
          color: theme.colors.error,
          text: statusTexts.TRANSACTION_ERROR,
          error: true,
        };

      default:
        return null;
    }
  }, [
    isWrongNetwork,
    isMaxValueError,
    isApproveButtonVisible,
    isPending,
    isTransactionLoading,
    isError,
    isTransactionError,
    isApproveButtonClicked,
    isTransactionSuccess,
  ]);

  const handleConnectButtonClick = useCallback(
    () => connect({ connector: connectors[0] }),
    [connect, connectors],
  );

  const handleActiveInputValueChange = useCallback(
    async (event: ChangeEvent<HTMLInputElement>) => {
      if (
        (event.target.value.length === 1 && event.target.value === '.') ||
        (!isNaN(Number(event.target.value)) && Number(event.target.value) >= 0)
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
          isApproveSuccess={isApproveButtonClicked && isTransactionSuccess}
          isLoading={isPending || isTransactionLoading}
          mintSOFI={mintSOFI}
          isApproveButtonVisible={isApproveButtonVisible}
        />
      }
      footer={<ExpertPageLinksBlock />}
    />
  );
};

export default ExpertPage;
