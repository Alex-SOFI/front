import {
  ChangeEvent,
  FunctionComponent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { QueryObserverResult, RefetchOptions } from '@tanstack/react-query';
import { formatUnits, parseUnits } from 'ethers';
import { Address } from 'viem';
import {
  useReadContract,
  useSwitchChain,
  useWaitForTransactionReceipt,
  useWriteContract,
} from 'wagmi';
import { ReadContractsErrorType, readContract } from 'wagmi/actions';

import wagmiConfig from 'configs/wagmiConfig';

import addresses from 'constants/addresses';
import chainIds from 'constants/chainIds';
import { tokenContract, tokenManagerContract } from 'constants/contracts';

import {
  selectIsMintSelected,
  selectIsWrongNetwork,
  selectWalletInfo,
} from 'ducks/wallet';
import { changeMintState } from 'ducks/wallet/slice';

import { formatBalance, status } from 'tools';

import {
  ExpertPageLinksBlock,
  ExpertPageMain,
} from 'components/pagesComponents/expertPage';

import { Layout } from 'components';

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
  const dispatch = useDispatch();

  const isMintSelected = !!useSelector(selectIsMintSelected);
  const setIsMintSelected = useCallback(
    (state: boolean) => {
      dispatch(changeMintState(state));
    },
    [dispatch],
  );

  const [activeInputValue, setActiveInputValue] = useState<string>('');
  const [calculatedInputValue, setCalculatedInputValue] = useState<string>('');

  const [isMaxValueError, setIsMaxValueError] = useState<boolean>(false);

  const { address, isConnected, balance, decimals } =
    useSelector(selectWalletInfo);

  const { switchChain } = useSwitchChain();

  const isWrongNetwork = useSelector(selectIsWrongNetwork);

  const [hash, setHash] = useState<Address>();

  const [isApproveButtonVisible, setIsApproveButtonVisible] =
    useState<boolean>(false);
  const [isApproveButtonClicked, setIsApproveButtonClicked] =
    useState<boolean>(false);
  const [isFunctionCalled, setIsFunctionCalled] = useState<boolean>(false);

  useEffect(() => {
    setIsFunctionCalled(false);
  }, [isMintSelected]);

  const {
    isPending,
    writeContract,
    writeContractAsync,
    isSuccess,
    isError,
    data,
    reset,
  } = useWriteContract();

  const {
    isLoading: isTransactionLoading,
    isError: isTransactionError,
    isSuccess: isTransactionSuccess,
  } = useWaitForTransactionReceipt({
    hash,
  });

  const success = useMemo(
    () => isSuccess && isTransactionSuccess,
    [isSuccess, isTransactionSuccess],
  );

  const error = useMemo(
    () => isError || isTransactionError,
    [isError, isTransactionError],
  );

  useEffect(() => {
    if (success) {
      refetchBalance();
    }
  }, [success, refetchBalance]);

  const { data: allowance, refetch: refetchAllowance } = useReadContract({
    ...tokenContract(tokenAddress),
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
    if (!allowance) {
      setIsApproveButtonVisible(true);
    }
    if (allowance === 0n) {
      setIsApproveButtonVisible(true);
    }
    if (success) {
      refetchAllowance();
      setIsApproveButtonVisible(false);
    }
  }, [
    address,
    tokenAddress,
    activeInputValue,
    decimals,
    allowance,
    refetchAllowance,
    isApproveButtonClicked,
    success,
  ]);

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

  const estimate = useCallback(
    async (value: string) => {
      const data = await readContract(wagmiConfig, {
        ...tokenManagerContract,
        functionName: isMintSelected ? 'estimateMint' : 'estimateRedeem',
        args: [parseUnits(value, decimals)],
      });
      return formatUnits(data as bigint, decimals);
    },
    [decimals, isMintSelected],
  );

  useEffect(() => {
    setActiveInputValue('');
  }, [isMintSelected]);

  useEffect(() => {
    const timeoutId = setTimeout(async () => {
      if (!isMaxValueError && activeValue) {
        const SOFIValue = await estimate(activeValue);

        if (Number(SOFIValue) > 0) {
          setCalculatedInputValue(SOFIValue);
        }
      } else {
        setCalculatedInputValue('');
      }
    }, 200);
    return () => clearTimeout(timeoutId);
  }, [
    activeValue,
    estimate,
    decimals,
    balance,
    isMaxValueError,
    isMintSelected,
  ]);

  const approveToken = useCallback(() => {
    if (address) {
      setIsApproveButtonClicked(true);
      writeContract({
        ...tokenContract(tokenAddress),
        functionName: 'approve',
        args: [addresses.TOKEN_MANAGER, parseUnits(activeValue, decimals)],
      });
    }
  }, [activeValue, address, decimals, tokenAddress, writeContract]);

  const mintOrRedeem = useCallback(async () => {
    setHash(undefined);
    setIsFunctionCalled(true);
    if (address && calculatedInputValue) {
      setIsApproveButtonClicked(false);
      await writeContractAsync({
        ...tokenManagerContract,
        functionName: isMintSelected ? 'mint' : 'redeem',
        args: isMintSelected
          ? [parseUnits(calculatedInputValue, decimals), 10000 /* temporary */]
          : [], // temporary
      });
    }
  }, [
    address,
    calculatedInputValue,
    writeContractAsync,
    isMintSelected,
    decimals,
  ]);

  const transactionStatus = useMemo(
    () =>
      status({
        isWrongNetwork,
        isMaxValueError,
        isApproveButtonVisible,
        isPending,
        isTransactionLoading,
        isApproveButtonClicked,
        setActiveInputValue,
        error,
        success,
        isTransactionError,
        isMintSelected,
        isFunctionCalled,
      }),
    [
      isWrongNetwork,
      isMaxValueError,
      isApproveButtonVisible,
      isPending,
      isTransactionLoading,
      isApproveButtonClicked,
      error,
      success,
      isTransactionError,
      isMintSelected,
      isFunctionCalled,
    ],
  );

  const handleActiveInputValueChange = useCallback(
    async (event: ChangeEvent<HTMLInputElement>) => {
      setHash(undefined);
      if (transactionStatus !== null) {
        reset();
      }
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
    [decimals, reset, transactionStatus],
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
          status={transactionStatus}
          isMintSelected={isMintSelected}
          setIsMintSelected={setIsMintSelected}
          activeInputValue={activeInputValue}
          handleActiveInputValueChange={handleActiveInputValueChange}
          calculatedInputValue={calculatedInputValue}
          setCalculatedInputValue={setCalculatedInputValue}
          handleSwitchButtonClick={handleSwitchButtonClick}
          approveToken={approveToken}
          isApproveSuccess={isApproveButtonClicked && success}
          isLoading={isPending || isTransactionLoading}
          mint={mintOrRedeem}
          isApproveButtonVisible={isApproveButtonVisible}
        />
      }
      footer={<ExpertPageLinksBlock />}
    />
  );
};

export default ExpertPage;
