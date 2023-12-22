import {
  ChangeEventHandler,
  Dispatch,
  FunctionComponent,
  SetStateAction,
} from 'react';

import styled from '@emotion/styled';
import Box from '@mui/material/Box';

import { PUBLIC_URL } from '../../../config';
import { theme } from '../../../styles/theme';
import { noop } from '../../../tools';
import { Button, ButtonWithIcon, Picture, Text, TextInput } from '../../basic';

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
  statusText: {
    color: string;
    text: string;
  } | null;
  isWrongNetwork: boolean;
  isMintSelected: boolean;
  setIsMintSelected: Dispatch<SetStateAction<boolean>>;
  USDCInputValue: string;
  handleUSDCInputValueChange: ChangeEventHandler<HTMLInputElement>;
  SOFIInputValue: string | number;
  setSOFIInputValue: Dispatch<SetStateAction<string | number>>;
  handleSwitchButtonClick: (chainId_?: number | undefined) => void;
}

const ExpertPageMain: FunctionComponent<ExpertPageMainProps> = ({
  handleConnectButtonClick,
  isConnected,
  balance,
  statusText,
  isWrongNetwork,
  isMintSelected,
  setIsMintSelected,
  USDCInputValue,
  handleUSDCInputValueChange,
  SOFIInputValue,
  setSOFIInputValue,
  handleSwitchButtonClick,
}) => {
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
            width: '5.625rem',
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
          disabled={!isConnected || isWrongNetwork} // temporary
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
        <Box sx={{ gridColumn: 2, width: '5.625rem' }} />
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
            width: '5.625rem',
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
        {isWrongNetwork && (
          <Text
            sx={{ gridColumn: 2 }}
            variant='body2'
            color={statusText?.color}
            ml='1rem'
          >
            {statusText?.text}
          </Text>
        )}
      </Box>

      {isConnected ? (
        isWrongNetwork ? (
          <Button onClick={() => handleSwitchButtonClick()}>
            Switch Network
          </Button>
        ) : (
          <Button onClick={noop} disabled={!USDCInputValue || !SOFIInputValue}>
            {isMintSelected ? 'Mint' : 'Redeem'}
          </Button>
        )
      ) : (
        <Button onClick={handleConnectButtonClick}>Connect Wallet</Button>
      )}
    </Box>
  );
};

export default ExpertPageMain;
