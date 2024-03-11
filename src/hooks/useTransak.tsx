import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { Transak, TransakConfig } from '@transak/transak-sdk';
import { Address, encodeFunctionData, formatUnits, parseUnits } from 'viem';

import addresses from 'constants/addresses';
import { publicClient, tokenManagerContract } from 'constants/contracts';
import SOFIabi from 'constants/sofiAbi';

const getMintCalldata = (address: Address, amount: number) => {
  if (!amount) return;

  return encodeFunctionData({
    abi: SOFIabi,
    functionName: 'mint',
    args: [address, parseUnits(amount.toString(), 18)],
  });
};

const useTransak = ({
  amount,
  address,
  setInputValue,
}: {
  amount: number;
  address?: Address;
  setInputValue: Dispatch<SetStateAction<string>>;
}) => {
  const [estimatedAmount, setEstimatedAmount] = useState<number | undefined>(
    undefined,
  );

  useEffect(() => {
    const estimateBalance = async () => {
      if (amount) {
        const data = await publicClient.readContract({
          ...tokenManagerContract,
          functionName: 'estimateMint',
          args: [parseUnits(amount.toString(), 18)],
        });
        setEstimatedAmount(Number(formatUnits(data as bigint, 18)));
      }
    };
    estimateBalance();
  }, [amount]);

  const calldata = useMemo(() => {
    return getMintCalldata(address!, estimatedAmount!);
  }, [address, estimatedAmount]);

  const transakConfig: TransakConfig = useMemo(() => {
    return {
      apiKey: import.meta.env.VITE_TRANSAK_API_KEY,
      environment: Transak.ENVIRONMENTS.STAGING,
      network: 'polygon',
      walletAddress: address,
      disableWalletAddressForm: true,
      defaultPaymentMethod: 'credit_debit_card',
      smartContractAddress: addresses.TOKEN_MANAGER,
      estimatedGasLimit: 300_000,
      fiatAmount: amount,
      fiatCurrency: 'USD',
      calldata,
      sourceTokenData: [
        {
          sourceTokenCode: 'USDC',
          sourceTokenAmount: estimatedAmount!,
        },
      ],
      cryptoCurrencyData: [
        {
          cryptoCurrencyCode: 'SOFI',
          cryptoCurrencyName: 'SOFI Token',
          cryptoCurrencyImageURL: '',
        },
      ],
      isTransakOne: true,
    };
  }, [address, amount, calldata, estimatedAmount]);

  const transak = useMemo(() => new Transak(transakConfig), [transakConfig]);

  const openModal = useCallback(() => {
    transak.openModal();
  }, [transak]);

  useEffect(() => {
    if (transak) {
      Transak.on(Transak.EVENTS.TRANSAK_WIDGET_CLOSE, () => {
        setInputValue('');
      });
      Transak.on(Transak.EVENTS.TRANSAK_ORDER_SUCCESSFUL, () => {
        setInputValue('');
        transak.close();
      });
    }
    return () => {
      transak.close();
    };
  }, [setInputValue, transak]);

  return { openModal };
};

export default useTransak;
