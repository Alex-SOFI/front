import { FunctionComponent, useState } from 'react';

import styled from '@emotion/styled';
import Box from '@mui/material/Box';
import { useConnect } from 'wagmi';

import { theme } from '../../../styles/theme';
import { noop } from '../../../tools';
import { Button, Text, TextInput } from '../../basic';
import ButtonWithIcon from '../../basic/ButtonWithIcon';

const InputGridBox = styled(Box)`
  display: grid;
  grid-template-columns: 1fr 1.5fr 1fr;
  width: 100%;
  margin-bottom: 1rem;
  align-items: center;

  @media (max-width: ${theme.breakpoints.sm}) {
    grid-template-columns: 1fr 2fr 1fr;
  }
`;

const ExpertPageMain: FunctionComponent = () => {
  const [isMintSelected, setIsMintSelected] = useState<boolean>(true);
  const [USDCInputValue, setUSDCInputValue] = useState<string>('');
  const [SOFIInputValue, setSOFIInputValue] = useState<string>('');

  const { connect, connectors, error, isLoading, pendingConnector } =
    useConnect();
  console.log(connect, connectors);

  // temporary
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isConnected, setIsConnected] = useState<boolean>(false);

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
        <Text justifySelf='end' pr='2rem' variant='body1'>
          USDC
        </Text>

        <TextInput
          placeholder='0'
          value={USDCInputValue}
          setValue={setUSDCInputValue}
          disabled={!isConnected} // temporary
        />
      </InputGridBox>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          marginBottom: '1rem',
        }}
      >
        <ButtonWithIcon
          onClick={() => setIsMintSelected((prevState) => !prevState)}
          isArrowDownward={isMintSelected}
        />
        <Text variant='body1'>Max: 0</Text>
      </Box>
      <InputGridBox>
        <Text justifySelf='end' pr='2rem' variant='body1'>
          SOFI
        </Text>

        <TextInput
          placeholder='0'
          value={SOFIInputValue}
          setValue={setSOFIInputValue}
          disabled={!isConnected} // temporary
        />
      </InputGridBox>
      <Text variant='body2' color={theme.colors.grayMedium} mb='2rem'>
        Fees Ï 0.00%
      </Text>
      {isConnected ? (
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
