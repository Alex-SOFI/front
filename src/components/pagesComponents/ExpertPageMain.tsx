import { FunctionComponent, useState } from 'react';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Unstable_Grid2';

import { theme } from '../../styles/theme';
import { noop } from '../../tools';
import { Button, Text, TextInput } from '../basic';
import ButtonWithIcon from '../basic/ButtonWithIcon';

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
      }}
    >
      <Grid
        container
        spacing={0}
        alignItems='center'
        justifyContent='center'
        mb={'5rem'}
      >
        <Grid xs={6} textAlign='center'>
          <Button
            isPrimaryColor={isMintSelected}
            onClick={() => setIsMintSelected(true)}
            variant='text'
          >
            Mint
          </Button>
        </Grid>
        <Grid xs={6} textAlign='center'>
          <Button
            isPrimaryColor={!isMintSelected}
            onClick={() => setIsMintSelected(false)}
            variant='text'
          >
            Redeem
          </Button>
        </Grid>
      </Grid>
      <Grid container mb='1rem' alignItems='center'>
        <Grid xs={4} textAlign='end'>
          <Text variant='body1'>USDC</Text>
        </Grid>
        <Grid xs={8}>
          <TextInput
            value={USDCInputValue}
            setValue={setUSDCInputValue}
            paddingLeft={'2rem'}
          />
        </Grid>
      </Grid>
      <Grid container mb='1rem' alignItems='center'>
        <Grid xs={7} mb={'1rem'} textAlign='end'>
          <ButtonWithIcon
            onClick={() => setIsMintSelected((prevState) => !prevState)}
            isArrowDownward={isMintSelected}
          />
        </Grid>
        <Grid xs={5} textAlign='start'>
          <Text variant='body1'>Max: 0</Text> {/* TODO: max value */}
        </Grid>
      </Grid>

      <Grid container mb='2rem' alignItems='center'>
        <Grid xs={4} textAlign='end'>
          <Text variant='body1'>SOFI</Text>
        </Grid>
        <Grid xs={8}>
          <TextInput
            value={SOFIInputValue}
            setValue={setSOFIInputValue}
            paddingLeft={'2rem'}
          />
        </Grid>
      </Grid>
      <Grid xs={8} textAlign='center' pl={'5rem'} mb={'3rem'}>
        <Text variant='body2' color={theme.colors.grayMedium}>
          Fees Ï 0.00%
        </Text>
      </Grid>
      <Grid xs={8} textAlign='center' pl={'5rem'} mb={'3rem'}>
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
      </Grid>
    </Box>
  );
};

export default ExpertPageMain;
