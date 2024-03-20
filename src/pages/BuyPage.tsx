import {
  ChangeEvent,
  FunctionComponent,
  useCallback,
  useEffect,
  useState,
} from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { useDecimals, useIsMobile, useTransak } from 'hooks';
import { Address } from 'viem';

import addresses from 'constants/addresses';
import routes from 'constants/routes';

import { selectWalletInfo } from 'ducks/wallet';

import { handleInputChange } from 'tools';

import { BuyPageMain } from 'components/pagesComponents/buyPage';

import { Layout } from 'components';

const BuyPage: FunctionComponent = () => {
  const { magicLinkAddress } = useSelector(selectWalletInfo);
  const isMobile = useIsMobile();
  const navigate = useNavigate();

  const [usdtInputValue, setUsdtInputValue] = useState<string>('');
  const [sophieInputValue, setSophieInputValue] = useState<string>('');

  const [isTransactionSuccess, setIsTransactionSuccessful] =
    useState<boolean>(false);

  useEffect(() => {
    const timeout = setTimeout(async () => {
      if (isTransactionSuccess) {
        navigate(routes.MAIN);
      }
    }, 2000);
    return () => clearTimeout(timeout);
  }, [isTransactionSuccess, navigate]);

  const usdtDecimals = useDecimals(addresses.USDT);
  const sophieDecimals = useDecimals(addresses.SOPHIE_TOKEN);

  const handleUsdtInputChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      handleInputChange(event, setUsdtInputValue, usdtDecimals!);
    },
    [usdtDecimals],
  );

  const handleSophieInputChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      handleInputChange(event, setSophieInputValue, sophieDecimals!);
    },
    [sophieDecimals],
  );

  const { openModal } = useTransak({
    amount: Number(usdtInputValue) || 0,
    address: magicLinkAddress as Address,
    setInputValue: setUsdtInputValue,
    setIsTransactionSuccessful,
  });

  return (
    <>
      <Layout
        main={
          <BuyPageMain
            handleButtonClick={openModal}
            usdtInputValue={usdtInputValue}
            handleUsdtInputChange={handleUsdtInputChange}
            sophieInputValue={sophieInputValue}
            handleSophieInputChange={handleSophieInputChange}
            isTransactionSuccess={isTransactionSuccess}
            isMobile={isMobile}
          />
        }
      />
    </>
  );
};

export default BuyPage;
