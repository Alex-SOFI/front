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
import SOFIabi from 'constants/sofiAbi';

const getMintCalldata = (address: Address, amount: number) => {
  if (!amount) return;

  return encodeFunctionData({
    abi: SOFIabi,
    functionName: 'mint',
    args: [address, parseUnits(amount.toString(), 18)],
  });
};

const getRedeemCalldata = (amount: number) => {
  if (!amount) return;

  return encodeFunctionData({
    abi: SOFIabi,
    functionName: 'redeem',
    args: [parseUnits(amount.toString(), 18)],
  });
};

const useTransak = ({
  amount,
  address,
  setInputValue,
  productsAvailed,
}: {
  amount: number;
  address?: Address;
  setInputValue: Dispatch<SetStateAction<string>>;
  productsAvailed: 'BUY' | 'SELL';
}) => {
  const calldata =
    productsAvailed === 'BUY'
      ? getMintCalldata(address!, amount)
      : getRedeemCalldata(amount);

  const transakConfig: TransakConfig = useMemo(() => {
    return {
      apiKey: import.meta.env.VITE_TRANSAK_API_KEY,
      environment: Transak.ENVIRONMENTS.STAGING,
      network: 'polygon',
      ...(productsAvailed === 'BUY' && {
        walletAddress: address,
        disableWalletAddressForm: true,
      }),
      defaultPaymentMethod: 'credit_debit_card',
      smartContractAddress: addresses.TOKEN_MANAGER,
      estimatedGasLimit: 300_000,
      calldata,
      sourceTokenData: [
        {
          sourceTokenCode: 'USDC',
          sourceTokenAmount: amount,
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
      productsAvailed,
    };
  }, [address, amount, calldata, productsAvailed]);

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
