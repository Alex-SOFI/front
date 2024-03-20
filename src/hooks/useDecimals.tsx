import { useEffect, useState } from 'react';

import { Address } from 'viem';

import { publicClient, tokenContract } from 'constants/contracts';

const useDecimals = (address: Address) => {
  const [decimals, setDecimals] = useState<number | undefined>(undefined);

  useEffect(() => {
    const result = async () => {
      await publicClient
        .readContract({
          ...tokenContract(address),
          functionName: 'decimals',
        })
        .then((decimals) => {
          setDecimals(decimals);
        });
    };
    result();
  }, [address]);

  return decimals;
};

export default useDecimals;
