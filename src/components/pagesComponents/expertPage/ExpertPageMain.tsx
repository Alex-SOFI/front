import {
  ChangeEventHandler,
  Dispatch,
  FunctionComponent,
  SetStateAction,
  useMemo,
} from 'react';

import styled from '@emotion/styled';
import Box from '@mui/material/Box';
import { PUBLIC_URL } from 'config';

import { noop } from 'tools';

import {
  Button,
  ButtonWithIcon,
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
  handleConnectButtonClick: () => void;
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
  setIsMintSelected: Dispatch<SetStateAction<boolean>>;
  USDCInputValue: string;
  handleUSDCInputValueChange: ChangeEventHandler<HTMLInputElement>;
  SOFIInputValue: string | number;
  setSOFIInputValue: Dispatch<SetStateAction<string | number>>;
  handleSwitchButtonClick: (chainId_?: number | undefined) => void;
  approveToken: () => void;
  isApproveSuccess: boolean;
  isApproveLoading: boolean;
}

const ExpertPageMain: FunctionComponent<ExpertPageMainProps> = ({
  handleConnectButtonClick,
  isConnected,
  balance,
  status,
  isWrongNetwork,
  isMaxValueError,
  isMintSelected,
  setIsMintSelected,
  USDCInputValue,
  handleUSDCInputValueChange,
  SOFIInputValue,
  setSOFIInputValue,
  handleSwitchButtonClick,
  approveToken,
  isApproveSuccess,
  isApproveLoading,
}) => {
  const renderButton = useMemo(() => {
    if (isConnected) {
      if (isWrongNetwork) {
        return (
          <Button onClick={() => handleSwitchButtonClick()}>
            Switch Network
          </Button>
        );
      } else {
        if (USDCInputValue && SOFIInputValue && !isApproveSuccess) {
          return (
            <Button
              onClick={approveToken}
              disabled={
                isMaxValueError ||
                isApproveLoading ||
                !USDCInputValue ||
                !SOFIInputValue
              }
            >
              Approve {isMintSelected ? 'USDC' : 'SOFI'}
            </Button>
          );
        } else {
          return (
            <Button
              onClick={noop}
              disabled={status?.error || !USDCInputValue || !SOFIInputValue}
            >
              {isMintSelected ? 'Mint SOFI' : 'Redeem SOFI'}
            </Button>
          );
        }
      }
    } else {
      return <Button onClick={handleConnectButtonClick}>Connect Wallet</Button>;
    }
  }, [
    SOFIInputValue,
    USDCInputValue,
    approveToken,
    handleConnectButtonClick,
    handleSwitchButtonClick,
    isApproveLoading,
    isApproveSuccess,
    isConnected,
    isMaxValueError,
    isMintSelected,
    isWrongNetwork,
    status?.error,
  ]);

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
          marginBottom: '5rem',
        }}
      >
        <Button
          isPrimaryColor={isMintSelected}
          onClick={() => setIsMintSelected(true)}
          variant='text'
        >
          Mint
        </Button>
        <Button
          isPrimaryColor={!isMintSelected}
          onClick={() => setIsMintSelected(false)}
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
          <Picture src={`${PUBLIC_URL}/icons/logo_usdc.png`} alt='USDC logo' />
          <Text pl='0.5rem' pr='1rem' variant='body1'>
            USDC
          </Text>
        </Box>
        <TextInput
          placeholder='0'
          value={USDCInputValue}
          onChange={handleUSDCInputValueChange}
          disabled={
            !isConnected ||
            isWrongNetwork ||
            (isMintSelected && isApproveSuccess)
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
          onClick={() => setIsMintSelected((prevState) => !prevState)}
          isArrowDownward={isMintSelected}
        />
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
          <Picture src={`${PUBLIC_URL}/icons/logo_sofi.webp`} alt='SOFI logo' />
          <Text pl='0.5rem' pr='1rem' variant='body1'>
            SOFI
          </Text>
        </Box>

        <TextInput
          placeholder='0'
          value={SOFIInputValue}
          onChange={(e) => setSOFIInputValue(e.target.value)}
          disabled={!isConnected || isWrongNetwork}
          readOnly
        />
      </InputGridBox>
      <Text variant='body2' color={theme.colors.grayMedium} mb='2rem'>
        Fees | 0.00%
      </Text>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: '0.25fr 3.25fr',
          width: '100%',
          lineHeight: '1.2em',
          minHeight: '4em',
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
