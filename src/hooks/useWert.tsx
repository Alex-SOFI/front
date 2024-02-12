/* eslint-disable camelcase */
import { useMemo } from 'react';

import WertWidget from '@wert-io/widget-initializer';
import { Address } from 'viem';

const useWert = (amount: string, address: Address) => {
  const options = useMemo(
    () => ({
      partner_id: '01HE2PGHPCVGNN9EBZ4F9FNZKF',
      origin: 'https://sandbox.wert.io',
      network: 'mumbai',
      commodities: JSON.stringify([
        {
          commodity: 'TT',
          network: 'mumbai',
        },
      ]),
      commodity_amount: Number(amount),
      address,
    }),
    [amount, address],
  );

  const wertWidget = new WertWidget(options);

  return wertWidget;
};

export default useWert;
