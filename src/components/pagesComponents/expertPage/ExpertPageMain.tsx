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
  grid-template-columns: 1fr 1.5fr 1fr;
  width: 100%;
  ${(props) => props.mb && `margin-bottom: ${props.mb};`}
  align-items: center;
  ${(props) => props.justifyItems && `justify-items: ${props.justifyItems};`}
  @media (max-width: ${theme.breakpoints.sm}) {
    grid-template-columns: 1fr 1.8fr 0.2fr;
  }
`;

interface ExpertPageMainProps {
  isConnected: boolean;
  balance: string | number | undefined;
  status: {
    text: JSX.Element;
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
  setMaxActiveValue: () => void;
}

const ExpertPageMain: FunctionComponent<ExpertPageMainProps> = ({
  isConnected,
  balance,
  status,
  isWrongNetwork,
  isMintSelected,
  setIsMintSelected,
  activeInputValue,
  handleActiveInputValueChange,
  calculatedInputValue,
  setCalculatedInputValue,
  handleSwitchButtonClick,
  isApproveSuccess,
  isLoading,
  mint,
  setMaxActiveValue,
}) => {
  const { open } = useWeb3Modal();
  const renderButton = useMemo(() => {
    if (isConnected) {
      if (isWrongNetwork) {
        return (
          <Button onClick={() => handleSwitchButtonClick()}>
            Switch Network
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
              {isMintSelected ? 'Mint SOPHIE' : 'Redeem SOPHIE'}
            </Text>
            {isLoading && <LoadingSpinner position='relative' size='22' />}
          </Button>
        );
      }
    } else {
      return <Button onClick={() => open()}>Connect Wallet</Button>;
    }
  }, [
    isConnected,
    isWrongNetwork,
    handleSwitchButtonClick,
    isLoading,
    activeInputValue,
    calculatedInputValue,
    isMintSelected,
    mint,
    status?.error,
    open,
  ]);

  const MATIC = useMemo(
    () => (
      <>
        <Picture src={`${PUBLIC_URL}/icons/logo_arb.svg`} alt='ARB logo' />
        <Text pl='0.5rem' pr='1rem' variant='body1'>
          ARB
        </Text>
      </>
    ),
    [],
  );

  const SOPHIE = useMemo(
    () => (
      <>
        <Picture
          src={`${PUBLIC_URL}/icons/logo_sophie.png`}
          alt='SOPHIE logo'
        />
        <Text pl='0.5rem' pr='1rem' variant='body1'>
          SOPHIE
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
        paddingBottom: theme.space.sm,
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column',
        justifyContent: 'center',
        margin: '5dvh auto 0 auto',
      }}
    >
      <InputGridBox>
        <Box
          sx={(theme) => ({
            display: 'flex',
            alignItems: 'center',
            marginLeft: '3rem',
            [theme.breakpoints.down('sm')]: {
              marginLeft: '1rem',
            },
          })}
        >
          {isMintSelected ? MATIC : SOPHIE}
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
        <Button
          variant='text'
          onClick={setMaxActiveValue}
          gridColumn={2}
          fontSize='14px'
          textColor={theme.colors.grayMedium}
          minHeight='0rem'
          lineHeight={1.5}
          justifySelf='end'
        >
          Max: {balance}
        </Button>
      </InputGridBox>
      <InputGridBox mb='1rem' justifyItems='center'>
        <Box sx={{ width: '6rem' }} />
        <ButtonWithIcon
          onClick={() => {
            setIsMintSelected(!isMintSelected);
          }}
          ariaLabel={
            isMintSelected ? 'Switch to redeem state' : 'Switch to mint state'
          }
          disabled={isLoading}
        >
          <ArrowDownwardIcon aria-label='mint' fontSize='large' />
        </ButtonWithIcon>
      </InputGridBox>
      <InputGridBox mb='1rem'>
        <Box
          sx={(theme) => ({
            display: 'flex',
            alignItems: 'center',
            marginLeft: '3rem',
            [theme.breakpoints.down('sm')]: {
              marginLeft: '1rem',
            },
          })}
        >
          {isMintSelected ? SOPHIE : MATIC}
        </Box>

        <TextInput
          placeholder='0'
          value={calculatedInputValue}
          onChange={(e) => setCalculatedInputValue(e.target.value)}
          disabled={!isConnected || isWrongNetwork}
          readOnly
        />
      </InputGridBox>
      <Text variant='body2' color={theme.colors.grayMedium} mb='3dvh'>
        Fees | {activeInputValue ? '~ 0.5%' : '0.00%'} {/* temporary */}
      </Text>

      <Box
        sx={(theme) => ({
          width: '100%',
          lineHeight: '1.2em',
          minHeight: 'clamp(3rem, 6.4dvh, 4rem)',
          marginLeft: '3rem',
          [theme.breakpoints.down('sm')]: {
            marginLeft: '0',
            textAlign: 'center',
            marginBottom: '0.5rem',
          },
        })}
      >
        {status && status?.text}
      </Box>
      {renderButton}
    </Box>
  );
};

export default ExpertPageMain;
