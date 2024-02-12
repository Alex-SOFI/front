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
import { useMagic } from 'hooks';
import useWert from 'hooks/useWert';
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

  const { signer, provider } = useMagic(window.location.pathname);

  console.log(signer);

  const erc20 = useMemo(() => {
    if (signer) {
      return new ethers.Contract(
        '0x879bad9DcD7e7f79B598a632103984FC090DA00D',
        erc20Abi,
        signer,
      );
    }
  }, [signer]);

  useEffect(() => {
    const aboba = async () => {
      if (erc20 && signer) {
        const b = await provider?.getNetwork();
        console.log(erc20);
        const a = await erc20.balanceOf(signer.getAddress());
        console.log(formatUnits(a, 18));
      }
    };
    aboba();
  }, [erc20, signer]);

  const wertWidget = useWert(
    investInputValue || '0',
    magicLinkAddress as Address,
  );

  useEffect(() => {
    wertWidget.addEventListeners({ close: () => setInvestInputValue('') });
  }, [wertWidget]);

  const handleBuyButtonClick = useCallback(() => {
    wertWidget.open();
  }, [wertWidget]);

  return (
    <>
      <Layout
        main={
          <BuyPageMain
            handleBuyButtonClick={handleBuyButtonClick}
            investInputValue={investInputValue}
            handleInputChange={handleInputChange}
          />
        }
      />
    </>
  );
};

export default BuyPage;
