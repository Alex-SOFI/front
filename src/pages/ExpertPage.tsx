import {
  ChangeEvent,
  FunctionComponent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useSelector } from 'react-redux';

import { formatUnits, parseUnits } from 'ethers';
import { Address, erc20Abi } from 'viem';
import {
  useConnect,
  useReadContract,
  useSwitchChain,
  useWaitForTransactionReceipt,
  useWriteContract,
} from 'wagmi';
import { readContract } from 'wagmi/actions';

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
}

const ExpertPage: FunctionComponent<ExpertPageProps> = ({ tokenAddress }) => {
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

  const {
    /* data: transactionData, */
    isLoading: isTransactionLoading,
    isError: isTransactionError,
    isSuccess: isTransactionSuccess,
  } = useWaitForTransactionReceipt({
    hash,
  });

  const { data: allowance, refetch } = useReadContract({
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
    if (isTransactionSuccess) {
      refetch();
      setIsApproveButtonVisible(false);
    }
  }, [
    address,
    tokenAddress,
    activeInputValue,
    decimals,
    allowance,
    isTransactionSuccess,
    refetch,
  ]);

  const {
    isPending: isApproveLoading,
    isSuccess: isApproveSuccess,
    writeContract: approve,
    writeContractAsync: mint,
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
      approve({
        address: tokenAddress,
        abi: erc20Abi,
        functionName: 'approve',
        args: [addresses.TOKEN_MANAGER, parseUnits(activeValue, decimals)],
      });
    }
  }, [activeValue, address, decimals, tokenAddress, approve]);

  const mintSOFI = useCallback(async () => {
    if (address && calculatedInputValue) {
      await mint({
        address: addresses.TOKEN_MANAGER,
        abi: SOFIabi,
        functionName: 'mint',
        args: [parseUnits(calculatedInputValue, decimals)],
      });
    }
  }, [address, calculatedInputValue, mint, decimals]);

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

      case isTransactionError:
        return {
          color: theme.colors.error,
          text: statusTexts.TRANSACTION_ERROR,
          error: true,
        };

      default:
        return null;
    }
  }, [isMaxValueError, isWrongNetwork, isTransactionError]);

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
          isApproveSuccess={isApproveSuccess}
          isApproveLoading={isApproveLoading || isTransactionLoading}
          mintSOFI={mintSOFI}
          isApproveButtonVisible={isApproveButtonVisible}
        />
      }
      footer={<ExpertPageLinksBlock />}
    />
  );
};

export default ExpertPage;
