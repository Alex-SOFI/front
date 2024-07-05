import { useEffect, useState } from 'react';

import { getValue } from 'ducks/balanceValue';

interface EthereumPriceResponse {
  ethereum: {
    usd: number;
  };
}

const useEthPrice = () => {
  const [price, setPrice] = useState<number>(0);

  const updatePrice = async () => {
    try {
      const {
        ethereum: { usd },
      } = (await getValue(
        'ethereum',
        'USD',
      )) as unknown as EthereumPriceResponse;

      setPrice(usd);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    updatePrice();
  }, []);

  return price;
};

export default useEthPrice;
