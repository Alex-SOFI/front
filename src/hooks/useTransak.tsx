import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
} from 'react';

import { Transak, TransakConfig } from '@transak/transak-sdk';
import { Address, encodeFunctionData, parseUnits } from 'viem';

import addresses from 'constants/addresses';
import sophieAbi from 'constants/sophieAbi';

const getMintCalldata = (address: Address, amount: number) => {
  if (!amount) return;

  return encodeFunctionData({
    abi: sophieAbi,
    functionName: 'mint',
    args: [address, parseUnits(amount.toString(), 18)],
  });
};

const useTransak = ({
  amount,
  address,
  setInputValue,
  setIsTransactionSuccessful,
}: {
  amount: number;
  address?: Address;
  setInputValue: Dispatch<SetStateAction<string>>;
  setIsTransactionSuccessful: Dispatch<SetStateAction<boolean>>;
}) => {
  const calldata = useMemo(() => {
    return getMintCalldata(address!, amount);
  }, [address, amount]);

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
      calldata,
      sourceTokenData: [
        {
          sourceTokenCode: 'USDT',
          sourceTokenAmount: amount,
        },
      ],
      cryptoCurrencyData: [
        {
          cryptoCurrencyCode: 'SOPHIE',
          cryptoCurrencyName: 'SOPHIE Token',
          cryptoCurrencyImageURL:
            'https://sofi-t-1823e8891b19.herokuapp.com/icons/logo_sophie.png', // TODO: change
        },
      ],
      isTransakOne: true,
    };
  }, [address, amount, calldata]);

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
        setIsTransactionSuccessful(true);
        transak.close();
      });
    }
    return () => {
      transak.close();
    };
  }, [setInputValue, setIsTransactionSuccessful, transak]);

  return { openModal };
};

export default useTransak;
