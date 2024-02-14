import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
} from 'react';

import { Transak, TransakConfig } from '@transak/transak-sdk';
import { Address } from 'viem';

const useTransak = (
  amount: number,
  address: Address,
  setInputValue: Dispatch<SetStateAction<string>>,
) => {
  const transakConfig: TransakConfig = useMemo(() => {
    return {
      apiKey: '0fd102fe-4030-473a-b2d0-79cf6bcb3c97',
      environment: Transak.ENVIRONMENTS.STAGING,
      network: 'Polygon',
      fiatAmount: amount,
      fiatCurrency: 'EUR',
      walletAddress: address,
      defaultPaymentMethod: 'credit_debit_card',
      cryptoCurrencyCode: 'USDC',
    };
  }, [address, amount]);

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
  }, [setInputValue, transak]);

  return { openModal };
};

export default useTransak;
