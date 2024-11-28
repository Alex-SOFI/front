import {
  ChangeEvent,
  FunctionComponent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { SelectChangeEvent } from '@mui/material/Select';
import { useDecimals, useMagic } from 'hooks';
import {
  Address,
  encodeFunctionData,
  erc20Abi,
  formatUnits,
  isAddress,
  parseUnits,
} from 'viem';
import { arbitrum, polygonMumbai } from 'viem/chains';

import addresses from 'constants/addresses';
import { publicClient, tokenContract } from 'constants/contracts';
import routes from 'constants/routes';
import { TOKEN_NAMES } from 'constants/textConstants';

import { selectWalletInfo } from 'ducks/wallet';

import { TransfertPageMain } from 'components/pagesComponents/transfertPage';

import { Layout } from 'components';

const TransfertPage: FunctionComponent = () => {
  const { magicLinkAddress } = useSelector(selectWalletInfo);
  const { walletClient } = useMagic(window.location.pathname);
  const navigate = useNavigate();

  const [tokenInputValue, setTokenInputValue] = useState<string>(
    TOKEN_NAMES.SOPHIE,
  );
  const [addressInputValue, setAddressInputValue] = useState<string>('');
  const [amountInputValue, setAmountInputValue] = useState<string>('');

  const [balance, setBalance] = useState<string>('');
  const [isTransactionLoading, setIsTransactionLoading] =
    useState<boolean>(false);

  const [isTransactionError, setIsTransactionError] = useState<boolean>(false);

  const [transactionErrorText, setTransactionErrorText] = useState<string>('');
  const [isMaxValueError, setIsMaxValueError] = useState<boolean>(false);
  useEffect(() => {
    if (Number(amountInputValue) > Number(balance)) {
      setIsMaxValueError(true);
    } else {
      setIsMaxValueError(false);
    }
  }, [amountInputValue, balance]);

  const sophieDecimals = useDecimals(addresses.SOPHIE_TOKEN);
  const usdtDecimals = useDecimals(addresses.USDT);

  useEffect(() => {
    const getBalance = async () => {
      let result;

      if (tokenInputValue !== TOKEN_NAMES.ETH) {
        result = await publicClient.readContract({
          ...tokenContract(
            tokenInputValue === TOKEN_NAMES.SOPHIE
              ? addresses.SOPHIE_TOKEN
              : addresses.USDT,
          ),
          functionName: 'balanceOf',
          args: [magicLinkAddress as Address],
        });
      } else {
        result = await publicClient.getBalance({
          address: magicLinkAddress,
        });
      }

      setBalance(
        formatUnits(
          result as bigint,
          tokenInputValue === TOKEN_NAMES.SOPHIE
            ? sophieDecimals!
            : usdtDecimals!,
        ),
      );
    };
    getBalance();
  }, [
    magicLinkAddress,
    isTransactionLoading,
    tokenInputValue,
    sophieDecimals,
    usdtDecimals,
  ]);

  const handleTokenInputChange = useCallback((event: SelectChangeEvent) => {
    setTokenInputValue(event.target.value);
  }, []);

  const handleAddressInputChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      setAddressInputValue(event.target.value.trim());
    },
    [],
  );

  const decimals = useDecimals(
    tokenInputValue === TOKEN_NAMES.SOPHIE
      ? addresses.SOPHIE_TOKEN
      : addresses.USDT,
  );

  const handleAmountInputChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      if (
        (event.target.value.length === 1 && event.target.value === '.') ||
        (!isNaN(Number(event.target.value)) && Number(event.target.value) >= 0)
      ) {
        const float = event.target.value.split('.')?.[1];
        if (!float || (float && float?.length <= decimals!)) {
          setAmountInputValue(event.target.value.trim());
        }
      }
    },
    [decimals],
  );

  const handleSendButtonClick = useCallback(async () => {
    setIsTransactionLoading(true);
    const estimatedGas = await publicClient.estimateGas({
      account: magicLinkAddress,
      to: addresses.TOKEN_MANAGER,
      data: encodeFunctionData({
        abi: erc20Abi,
        functionName: 'transfer',
        args: [
          addressInputValue as Address,
          parseUnits(amountInputValue, decimals!),
        ],
      }),
    });

    const hash = await walletClient
      ?.sendTransaction({
        account: magicLinkAddress,
        chain:
          import.meta.env.VITE_ENV === 'staging' ? polygonMumbai : arbitrum,
        to:
          tokenInputValue === TOKEN_NAMES.SOPHIE
            ? addresses.SOPHIE_TOKEN
            : addresses.USDT,
        data: encodeFunctionData({
          abi: erc20Abi,
          functionName: 'transfer',
          args: [
            addressInputValue as Address,
            parseUnits(amountInputValue, decimals!),
          ],
        }),
        gas: estimatedGas,
      })
      .catch((error) => {
        setIsTransactionLoading(false);
        setIsTransactionError(true);
        setTransactionErrorText(error?.details);
      });
    if (hash) {
      const transaction = await publicClient.waitForTransactionReceipt({
        hash,
      });
      if (transaction.status === 'success') {
        setIsTransactionLoading(false);
      }
      setTokenInputValue(TOKEN_NAMES.SOPHIE);
      setAddressInputValue('');
      setAmountInputValue('');
      navigate(routes.MAIN);
    }
  }, [
    addressInputValue,
    amountInputValue,
    decimals,
    magicLinkAddress,
    navigate,
    tokenInputValue,
    walletClient,
  ]);

  const invalidAddressError = useMemo(
    () => !!(addressInputValue && !isAddress(addressInputValue)),
    [addressInputValue],
  );

  const setMaxValue = useCallback(() => {
    setAmountInputValue(balance!);
  }, [balance]);

  return (
    <>
      <Layout
        main={
          <TransfertPageMain
            handleSendButtonClick={handleSendButtonClick}
            addressInputValue={addressInputValue}
            handleAddressInputChange={handleAddressInputChange}
            amountInputValue={amountInputValue}
            handleAmountInputChange={handleAmountInputChange}
            invalidAddressError={invalidAddressError}
            tokenInputValue={tokenInputValue}
            handleTokenInputChange={handleTokenInputChange}
            isTransactionLoading={isTransactionLoading}
            isTransactionError={isTransactionError}
            transactionErrorText={transactionErrorText}
            isMaxValueError={isMaxValueError}
            setMaxValue={setMaxValue}
            balance={Number(balance)}
          />
        }
      />
    </>
  );
};

export default TransfertPage;
