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

const getSupplyCalldata = (address: Address, amount: number | null) => {
  if (!amount) return;

  return encodeFunctionData({
    abi: SOFIabi,
    functionName: 'mint',
    args: [address, parseUnits(amount.toString(), 18)],
  });
};

const useTransak = (
  amount: number,
  address: Address,
  setInputValue: Dispatch<SetStateAction<string>>,
) => {
  const calldata = getSupplyCalldata(address, amount);

  const transakConfig: TransakConfig = useMemo(() => {
    return {
      apiKey: '0fd102fe-4030-473a-b2d0-79cf6bcb3c97',
      environment: Transak.ENVIRONMENTS.STAGING,
      network: 'polygon',
      walletAddress: address,
      defaultPaymentMethod: 'credit_debit_card',
      disableWalletAddressForm: true,
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
