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
import {
  Address,
  formatEther,
  formatUnits,
  parseEther,
  parseUnits,
} from 'viem';
import {
  useBalance,
  useReadContract,
  useSwitchChain,
  useWaitForTransactionReceipt,
  useWriteContract,
} from 'wagmi';
import { ReadContractsErrorType, readContract } from 'wagmi/actions';

import wagmiConfig from 'configs/wagmiConfig';

import { UserState } from 'interfaces';

import addresses from 'constants/addresses';
import { tokenContract, tokenManagerContract } from 'constants/contracts';

import {
  selectIsMintSelected,
  selectIsWrongNetwork,
  selectWalletInfo,
} from 'ducks/wallet';
import { changeMintState } from 'ducks/wallet/slice';

import { formatBalance, status } from 'tools';

import { ExpertPageMain } from 'components/pagesComponents/expertPage';

import { Layout } from 'components';

interface ExpertPageProps {
  tokenAddress: Address;
  refetchBalance: (
    options?: RefetchOptions | undefined,
  ) => Promise<
    QueryObserverResult<[bigint, number, string], ReadContractsErrorType>
  >;
  dispatchUser: (payload: UserState) => void;
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

  const { data: nativeBalance } = useBalance({
    address: address,
  });

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
    if (!allowance || allowance === 0n) {
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
    () => (Number(activeInputValue) === 0 ? '0' : activeInputValue),
    [activeInputValue],
  );

  useEffect(() => {
    if (data) {
      setHash(data);
    }
  }, [data]);

  const estimate = useCallback(
    async (value: string) => {
      const data = await readContract(wagmiConfig, {
        ...tokenManagerContract,
        functionName: isMintSelected ? 'estimateMint' : 'estimateRedeem',
        args: [parseEther(value)],
      });
      return formatEther(data);
    },
    [isMintSelected],
  );

  useEffect(() => {
    setActiveInputValue('');
  }, [isMintSelected]);

  useEffect(() => {
    const timeout = setTimeout(async () => {
      if (!isMaxValueError && activeValue !== '0') {
        const estimatedValue = await estimate(activeValue);

        if (Number(estimatedValue) > 0) {
          setCalculatedInputValue(estimatedValue);
        }
      } else {
        setCalculatedInputValue('');
      }
    }, 200);
    return () => clearTimeout(timeout);
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
    if (address) {
      if (isMintSelected) {
        await writeContractAsync({
          ...tokenManagerContract,
          functionName: 'mint',
          args: [address, parseEther(activeValue)],
          value: parseEther(activeValue) as any,
        });
      } else {
        await writeContractAsync({
          ...tokenManagerContract,
          functionName: 'redeem',
          args: [parseEther(activeValue)],
        });
      }
    }
  }, [address, activeValue, writeContractAsync, isMintSelected]);

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
        hash,
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
      hash,
    ],
  );

  const handleActiveInputValueChange = useCallback(
    async (event: ChangeEvent<HTMLInputElement>) => {
      setHash(undefined);
      if (transactionStatus !== null) {
        reset();
      }
      if (
        ((event.target.value.length === 1 && event.target.value === '.') ||
          (!isNaN(Number(event.target.value)) &&
            Number(event.target.value) >= 0)) &&
        Number(event.target.value) <= Number.MAX_SAFE_INTEGER
      ) {
        const float = event.target.value.split('.')?.[1];
        if (!float || (float && float?.length <= decimals)) {
          setActiveInputValue(event.target.value.trim());
        }
      }
    },
    [decimals, reset, transactionStatus],
  );

  const handleSwitchButtonClick = useCallback(() => {
    switchChain({ chainId: Number(import.meta.env.VITE_POLYGON_CHAIN_ID) });
  }, [switchChain]);

  const formatedBalance = useMemo(() => {
    if (isMintSelected) {
      if (!nativeBalance) {
        return 0;
      }

      return formatEther(nativeBalance?.value);
    }
    return formatBalance(balance, 3);
  }, [balance, isMintSelected, nativeBalance]);

  const setMaxActiveValue = useCallback(() => {
    if (formatedBalance) {
      setActiveInputValue(formatedBalance);
    }
  }, [formatedBalance]);

  useEffect(() => {
    if (Number(activeValue) > Number(formatedBalance)) {
      setIsMaxValueError(true);
    } else {
      setIsMaxValueError(false);
    }
  }, [activeValue, formatedBalance]);

  return (
    <Layout
      isMintSelected={isMintSelected}
      setIsMintSelected={setIsMintSelected}
      isTransactionLoading={isTransactionLoading}
      main={
        <ExpertPageMain
          isConnected={isConnected}
          balance={formatedBalance}
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
          setMaxActiveValue={setMaxActiveValue}
        />
      }
    />
  );
};

export default ExpertPage;
