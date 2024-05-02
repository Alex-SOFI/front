import { FunctionComponent } from 'react';

import Box from '@mui/material/Box';

import { Text } from './basic';

const MarketingClaim: FunctionComponent = () => {
  return (
    <Box
      display='flex'
      flexDirection='column'
      alignItems='center'
      marginTop='5dvh'
    >
      <Text fontSize={30} fontWeight={800} variant='h3' textAlign='center'>
        $SOPHIE Token (Pre-launching)
      </Text>
      <Text marginTop='1.5dvh' variant='h3'>
        So easy - So secured - So Effective
      </Text>
    </Box>
  );
};

export default MarketingClaim;
