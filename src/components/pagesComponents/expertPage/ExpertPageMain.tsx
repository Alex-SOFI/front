import { FunctionComponent, useState } from 'react';

import Box from '@mui/material/Box';

import { theme } from '../../../styles/theme';
import { noop } from '../../../tools';
import { Button, Text, TextInput } from '../../basic';
import ButtonWithIcon from '../../basic/ButtonWithIcon';

const ExpertPageMain: FunctionComponent = () => {
  const [isMintSelected, setIsMintSelected] = useState<boolean>(true);
  const [USDCInputValue, setUSDCInputValue] = useState<string>('');
  const [SOFIInputValue, setSOFIInputValue] = useState<string>('');

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
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: '1fr 1.5fr 1fr',
          width: '100%',
          marginBottom: '1rem',
          alignItems: 'center',
          '@media (max-width: 768px)': {
            gridTemplateColumns: '1fr 2fr 1fr',
          },
        }}
      >
        <Text justifySelf='end' pr='2rem' variant='body1'>
          USDC
        </Text>

        <TextInput
          placeholder='0'
          value={USDCInputValue}
          setValue={setUSDCInputValue}
        />
      </Box>
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
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: '1fr 1.5fr 1fr',
          width: '100%',
          marginBottom: '1rem',
          alignItems: 'center',
          '@media (max-width: 768px)': {
            gridTemplateColumns: '1fr 2fr 1fr',
          },
        }}
      >
        <Text justifySelf='end' pr='2rem' variant='body1'>
          SOFI
        </Text>

        <TextInput
          placeholder='0'
          value={SOFIInputValue}
          setValue={setSOFIInputValue}
        />
      </Box>
      <Text variant='body2' color={theme.colors.grayMedium} mb='2rem'>
        Fees Ï 0.00%
      </Text>
      {isConnected ? (
        <Button onClick={noop}>
          {/* TODO: add onClick */}
          {isMintSelected ? 'Mint' : 'Redeem'}
        </Button>
      ) : (
        <Button onClick={noop}>
          {/* TODO: add onClick */}
          Connect Wallet
        </Button>
      )}
    </Box>
  );
};

export default ExpertPageMain;
