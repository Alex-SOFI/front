import { FunctionComponent, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';

import styled from '@emotion/styled';
import Box from '@mui/material/Box';
import { useConnect } from 'wagmi';

import { PUBLIC_URL } from '../../../config';
import { selectIsWrongNetwork, selectWalletInfo } from '../../../ducks/wallet';
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

const ExpertPageMain: FunctionComponent = () => {
  const [isMintSelected, setIsMintSelected] = useState<boolean>(true);
  const [USDCInputValue, setUSDCInputValue] = useState<string>('');
  const [SOFIInputValue, setSOFIInputValue] = useState<string>('');

  const { connect, connectors } = useConnect();

  const { isConnected, balance } = useSelector(selectWalletInfo);

  const isWrongNetwork = useSelector(selectIsWrongNetwork);

  const statusText = useMemo(() => {
    switch (true) {
      case isWrongNetwork:
        return {
          color: theme.colors.error,
          text: 'Unsupported network detected, switch to Polygon to continue.',
        };

      default:
        return null;
    }
  }, [isWrongNetwork]);

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
          setValue={setUSDCInputValue}
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
          setValue={setSOFIInputValue}
          disabled={!isConnected || isWrongNetwork} // temporary
        />
      </InputGridBox>
      <Text variant='body2' color={theme.colors.grayMedium} mb='2rem'>
        Fees | 0.00%
      </Text>
      {isWrongNetwork && ( // temporary condition
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: '0.25fr 3.25fr',
            width: '100%',
            marginBottom: '2rem',
          }}
        >
          <Text
            sx={{ gridColumn: 2 }}
            variant='body2'
            color={statusText?.color}
            ml='1rem'
          >
            {statusText?.text}
          </Text>
        </Box>
      )}
      {isConnected && !isWrongNetwork ? (
        <Button
          onClick={noop}
          disabled={!USDCInputValue || !SOFIInputValue} /* temporary */
        >
          {/* TODO: add onClick */}
          {isMintSelected ? 'Mint' : 'Redeem'}
        </Button>
      ) : (
        <Button onClick={() => connect({ connector: connectors[0] })}>
          {/* TODO: add onClick */}
          Connect Wallet
        </Button>
      )}
    </Box>
  );
};

export default ExpertPageMain;
