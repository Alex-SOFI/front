import {
  ChangeEvent,
  FunctionComponent,
  useCallback,
  useMemo,
  useState,
} from 'react';
import { useSelector } from 'react-redux';

import { SelectChangeEvent } from '@mui/material/Select';
import { useMagic } from 'hooks';
import {
  Address,
  encodeFunctionData,
  erc20Abi,
  isAddress,
  parseUnits,
} from 'viem';
import { polygonMumbai } from 'viem/chains';

import addresses from 'constants/addresses';
import {
  publicClient,
  tokenContract,
  tokenManagerContract,
} from 'constants/contracts';
import { TOKEN_NAMES } from 'constants/textConstants';

import { selectWalletInfo } from 'ducks/wallet';

import { TransfertPageMain } from 'components/pagesComponents/transfertPage';

import { Layout } from 'components';

const TransfertPage: FunctionComponent = () => {
  const { magicLinkAddress } = useSelector(selectWalletInfo);
  const { walletClient } = useMagic(window.location.pathname);

  const [tokenInputValue, setTokenInputValue] = useState<string>(
    TOKEN_NAMES.SOFI,
  );
  const [addressInputValue, setAddressInputValue] = useState<string>('');
  const [amountInputValue, setAmountInputValue] = useState<string>('');

  const handleTokenInputChange = useCallback((event: SelectChangeEvent) => {
    setTokenInputValue(event.target.value);
  }, []);

  const handleAddressInputChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      setAddressInputValue(event.target.value.trim());
    },
    [],
  );

  const handleAmountInputChange = useCallback(
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
          setAmountInputValue(event.target.value.trim());
        }
      }
    },
    [],
  );
  // TODO: change to mainnet
  const handleSendButtonClick = useCallback(async () => {
    const decimals =
      tokenInputValue === TOKEN_NAMES.SOFI
        ? await publicClient.readContract({
            ...tokenManagerContract,
            functionName: 'decimals',
          })
        : await publicClient.readContract({
            ...tokenContract(addresses.USDC_MUMBAI),
            functionName: 'decimals',
          });

    await walletClient?.sendTransaction({
      account: magicLinkAddress,
      chain: polygonMumbai,
      to:
        tokenInputValue === TOKEN_NAMES.SOFI
          ? addresses.SOFI_TOKEN
          : addresses.USDC_MUMBAI, // TODO: change to USDC
      data: encodeFunctionData({
        abi: erc20Abi,
        functionName: 'transfer',
        args: [
          addressInputValue as Address,
          parseUnits(amountInputValue, decimals as number),
        ],
      }),
    });
  }, [
    addressInputValue,
    amountInputValue,
    magicLinkAddress,
    tokenInputValue,
    walletClient,
  ]);

  const invalidAddressError = useMemo(
    () => !!(addressInputValue && !isAddress(addressInputValue)),
    [addressInputValue],
  );

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
          />
        }
      />
    </>
  );
};

export default TransfertPage;
