import {
  ChangeEvent,
  FunctionComponent,
  useCallback,
  useEffect,
  useState,
} from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { useTransak } from 'hooks';
import { Address } from 'viem';

import routes from 'constants/routes';

import { selectWalletInfo } from 'ducks/wallet';

import { handleInputChange } from 'tools';

import { BuyPageMain } from 'components/pagesComponents/buyPage';

import { Layout } from 'components';

const BuyPage: FunctionComponent = () => {
  const { address: magicLinkAddress } = useSelector(selectWalletInfo);

  const navigate = useNavigate();

  const [inputValue, setInputValue] = useState<string>('');
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

  const handleInvestInputChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      handleInputChange(event, setInputValue);
    },
    [],
  );

  const { openModal } = useTransak({
    amount: Number(inputValue) || 0,
    address: magicLinkAddress as Address,
    setInputValue,
    setIsTransactionSuccessful,
  });

  return (
    <>
      <Layout
        main={
          <BuyPageMain
            handleButtonClick={openModal}
            inputValue={inputValue}
            handleInputChange={handleInvestInputChange}
            isSellPage={false}
            isTransactionSuccess={isTransactionSuccess}
          />
        }
      />
    </>
  );
};

export default BuyPage;
