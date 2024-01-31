import {
  ChangeEventHandler,
  Dispatch,
  FunctionComponent,
  SetStateAction,
  useMemo,
} from 'react';

import styled from '@emotion/styled';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import Box from '@mui/material/Box';
import { useWeb3Modal } from '@web3modal/wagmi/react';
import { PUBLIC_URL } from 'config';
import useMagic from 'hooks/useMagic';

import statusTexts from 'constants/statusTexts';

import {
  Button,
  ButtonWithIcon,
  LoadingSpinner,
  Picture,
  Text,
  TextInput,
} from 'components/basic';

import { theme } from 'styles/theme';

interface InputGridBoxProps {
  mb?: string;
  justifyItems?: string;
}

const InputGridBox = styled(Box)<InputGridBoxProps>`
  display: grid;
  grid-template-columns: 0.25fr 0.75fr 1.5fr 1fr;
  width: 100%;
  ${(props) => props.mb && `margin-bottom: ${props.mb};`}
  align-items: center;
  ${(props) => props.justifyItems && `justify-items: ${props.justifyItems};`}

  @media (max-width: ${theme.breakpoints.sm}) {
    grid-template-columns: 0.25fr 0.75fr 2fr 1fr;
  }
`;

interface ExpertPageMainProps {
  isConnected: boolean;
  balance: string | number | undefined;
  status: {
    color: string;
    text: string;
    error: boolean;
  } | null;
  isWrongNetwork: boolean;
  isMaxValueError: boolean;
  isMintSelected: boolean;
  setIsMintSelected: (state: boolean) => void;
  activeInputValue: string;
  handleActiveInputValueChange: ChangeEventHandler<HTMLInputElement>;
  calculatedInputValue: string;
  setCalculatedInputValue: Dispatch<SetStateAction<string>>;
  handleSwitchButtonClick: (chainId_?: number | undefined) => void;
  approveToken: () => void;
  isApproveSuccess: boolean;
  isLoading: boolean;
  mint: () => void;
  isApproveButtonVisible?: boolean;
}

const ExpertPageMain: FunctionComponent<ExpertPageMainProps> = ({
  isConnected,
  balance,
  status,
  isWrongNetwork,
  isMaxValueError,
  isMintSelected,
  setIsMintSelected,
  activeInputValue,
  handleActiveInputValueChange,
  calculatedInputValue,
  setCalculatedInputValue,
  handleSwitchButtonClick,
  approveToken,
  isApproveSuccess,
  isLoading,
  mint,
  isApproveButtonVisible,
}) => {
  const { open } = useWeb3Modal();
  const isTransactionLoading = useMemo(
    () =>
      status?.text === (statusTexts.MINT_LOADING || statusTexts.REDEEM_LOADING),
    [status?.text],
  );
  const renderButton = useMemo(() => {
    if (isConnected) {
      if (isWrongNetwork) {
        return (
          <Button onClick={() => handleSwitchButtonClick()}>
            Switch Network
          </Button>
        );
      } else {
        if (isApproveButtonVisible) {
          return (
            <Button
              onClick={approveToken}
              disabled={
                isMaxValueError ||
                isLoading ||
                !activeInputValue ||
                !calculatedInputValue
              }
            >
              <Box
                display='flex'
                justifyContent='space-between'
                alignItems='center'
              >
                <Text color='inherit' fontWeight={500} mr='0.15rem'>
                  Approve {isMintSelected ? 'USDC' : 'SOFI'}
                </Text>
                {isLoading && <LoadingSpinner position='relative' size='22' />}
              </Box>
            </Button>
          );
        } else {
          return (
            <Button
              onClick={mint}
              disabled={
                status?.error ||
                isLoading ||
                !activeInputValue ||
                !calculatedInputValue
              }
            >
              <Text color='inherit' fontWeight={500} mr='0.15rem'>
                {isMintSelected ? 'Mint SOFI' : 'Redeem SOFI'}
              </Text>
              {isLoading && <LoadingSpinner position='relative' size='22' />}
            </Button>
          );
        }
      }
    } else {
      return <Button onClick={() => open()}>Connect Wallet</Button>;
    }
  }, [
    isConnected,
    isWrongNetwork,
    handleSwitchButtonClick,
    isApproveButtonVisible,
    approveToken,
    isMaxValueError,
    isLoading,
    activeInputValue,
    calculatedInputValue,
    isMintSelected,
    mint,
    status?.error,
    open,
  ]);

  const { logoutUser } = useMagic(window.location.pathname);

  const USDC = useMemo(
    () => (
      <>
        <Picture src={`${PUBLIC_URL}/icons/logo_usdc.png`} alt='USDC logo' />
        <Text pl='0.5rem' pr='1rem' variant='body1'>
          USDC
        </Text>
      </>
    ),
    [],
  );

  const SOFI = useMemo(
    () => (
      <>
        <Picture src={`${PUBLIC_URL}/icons/logo_sofi.webp`} alt='SOFI logo' />
        <Text pl='0.5rem' pr='1rem' variant='body1'>
          SOFI
        </Text>
      </>
    ),
    [],
  );

  return (
    <Box
      sx={{
        maxWidth: theme.breakpoints.sm,
        paddingTop: theme.space.sm,
        paddingVottom: theme.space.sm,
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column',
        justifyContent: 'center',
      }}
    >
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          width: '100%',
          marginBottom: 'clamp(0.5rem, 8dvh, 5rem)',
        }}
      >
        <Button
          isPrimaryColor={isMintSelected}
          onClick={() => setIsMintSelected(true)}
          disabled={isTransactionLoading}
          variant='text'
        >
          Mint
        </Button>
        <Button
          isPrimaryColor={!isMintSelected}
          onClick={() => setIsMintSelected(false)}
          disabled={isTransactionLoading}
          variant='text'
        >
          Redeem
        </Button>
      </Box>
      <InputGridBox>
        <Box
          sx={{
            gridColumn: 2,
            display: 'flex',
            marginLeft: '1rem',
            width: '6rem',
          }}
        >
          {isMintSelected ? USDC : SOFI}
        </Box>
        <TextInput
          placeholder='0'
          value={activeInputValue}
          onChange={handleActiveInputValueChange}
          disabled={
            !isConnected ||
            isWrongNetwork ||
            isLoading ||
            (isApproveSuccess && !!activeInputValue)
          }
        />
      </InputGridBox>
      <InputGridBox>
        <Text
          sx={{ gridColumn: 3, textAlign: 'end' }}
          variant='body1'
          color={theme.colors.grayMedium}
          fontSize='14px'
        >
          Max: {balance}
        </Text>
      </InputGridBox>
      <InputGridBox mb='1rem' justifyItems='center'>
        <Box sx={{ gridColumn: 2, width: '6rem' }} />
        <ButtonWithIcon
          onClick={
            /* () => {
              setIsMintSelected(!isMintSelected);
            } */ () => logoutUser(/* dispatchUser */)
          }
          ariaLabel={
            isMintSelected ? 'Switch to redeem state' : 'Switch to mint state'
          }
          disabled={isTransactionLoading}
        >
          <ArrowDownwardIcon aria-label='mint' fontSize='large' />
        </ButtonWithIcon>
      </InputGridBox>
      <InputGridBox mb='1rem'>
        <Box
          sx={{
            gridColumn: 2,
            display: 'flex',
            marginLeft: '1rem',
            width: '6rem',
          }}
        >
          {isMintSelected ? SOFI : USDC}
        </Box>

        <TextInput
          placeholder='0'
          value={calculatedInputValue}
          onChange={(e) => setCalculatedInputValue(e.target.value)}
          disabled={!isConnected || isWrongNetwork}
          readOnly
        />
      </InputGridBox>
      <Text
        variant='body2'
        color={theme.colors.grayMedium}
        mb='clamp(0, 3.2dvh, 2rem)'
      >
        Fees | 0.00%
      </Text>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: '0.25fr 3.25fr',
          width: '100%',
          lineHeight: '1.2em',
          minHeight: 'clamp(3rem, 6.4dvh, 4rem)',
        }}
      >
        {status && (
          <Text
            sx={{ gridColumn: 2 }}
            variant='body2'
            color={status?.color}
            ml='1rem'
          >
            {status?.text}
          </Text>
        )}
      </Box>
      {renderButton}
    </Box>
  );
};

export default ExpertPageMain;
