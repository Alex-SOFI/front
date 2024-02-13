import {
  ChangeEvent,
  FunctionComponent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useSelector } from 'react-redux';

import { ethers, formatUnits } from 'ethers';
import { useMagic, useTransak } from 'hooks';
import useWert from 'hooks/useTransak';
import { Address, erc20Abi } from 'viem';

import addresses from 'constants/addresses';

import { selectWalletInfo } from 'ducks/wallet';

import { BuyPageMain } from 'components/pagesComponents/buyPage';

import { Layout } from 'components';

const BuyPage: FunctionComponent = () => {
  const { magicLinkAddress } = useSelector(selectWalletInfo);

  const [investInputValue, setInvestInputValue] = useState<string>('');

  const handleInputChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      if (
        (event.target.value.length === 1 && event.target.value === '.') ||
        (!isNaN(Number(event.target.value)) && Number(event.target.value) >= 0)
      ) {
        const float = event.target.value.split('.')?.[1];
        if (
          !float ||
          (float &&
            float?.length <= /* decimals */ 18) /* TODO: get USDC(?) decimals */
        ) {
          setInvestInputValue(event.target.value);
        }
      }
    },
    [],
  );

  const { signer } = useMagic(window.location.pathname);

  const erc20 = useMemo(() => {
    if (signer) {
      return new ethers.Contract(
        '0x879bad9DcD7e7f79B598a632103984FC090DA00D',
        erc20Abi,
        signer,
      );
    }
  }, [signer]);

  const { openModal } = useTransak(
    Number(investInputValue) || 0,
    magicLinkAddress as Address,
    setInvestInputValue,
  );

  return (
    <>
      <Layout
        main={
          <BuyPageMain
            handleBuyButtonClick={openModal}
            investInputValue={investInputValue}
            handleInputChange={handleInputChange}
          />
        }
      />
    </>
  );
};

export default BuyPage;
