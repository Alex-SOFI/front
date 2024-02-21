import { FunctionComponent } from 'react';

import styled from '@emotion/styled';
import Box from '@mui/material/Box';

import { MagicLinkBalance } from 'interfaces/WalletInfoState';

import { Button, Text } from 'components/basic';

import { theme } from 'styles/theme';

const StyledBox = styled(Box)`
  max-width: ${theme.breakpoints.sm};
  margin: 0 auto;
  width: 70%;
  height: 100%;
  display: flex;
  align-items: center;
  flex-direction: column;
  @media (max-width: ${theme.breakpoints.sm}) {
    width: 90%;
  }
`;

const GridBox = styled(Box)`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  width: 100%;
  align-items: center;
`;

interface DashboardPageMainProps {
  balance: MagicLinkBalance | null;
  balanceValue: {
    SOFI?: string | null;
    USDC?: string | null;
    MATIC?: string | null;
  };
  navigateToBuyPage: () => void;
}

const DashboardPageMain: FunctionComponent<DashboardPageMainProps> = ({
  balance,
  balanceValue,
  navigateToBuyPage,
}) => {
  return (
    <StyledBox>
      <Text
        fontWeight={500}
        color={theme.colors.primary}
        alignSelf='start'
        ml='1rem'
        mb='1rem'
        mt='10dvh'
      >
        Balance
      </Text>
      <GridBox>
        <Text fontWeight={500} justifySelf='start' ml='1rem'>
          Tokens
        </Text>
        <Text fontWeight={500} justifySelf='end' mr='1rem'>
          Qty
        </Text>
        <Text fontWeight={500} justifySelf='end' mr='1rem'>
          Value
        </Text>
      </GridBox>
      {balance !== null ? (
        <>
          <GridBox marginTop='3dvh'>
            <Text justifySelf='start' ml='1rem'>
              SOPHIE
            </Text>
            <Text justifySelf='end' mr='1rem'>
              {balance?.SOFI || '0'}
            </Text>
            <Text justifySelf='end' mr='1rem'>
              {balanceValue?.SOFI || '0'}$
            </Text>
          </GridBox>

          <GridBox marginTop='1dvh'>
            <Text justifySelf='start' ml='1rem'>
              USDC
            </Text>
            <Text justifySelf='end' mr='1rem'>
              {balance?.USDC || '0'}
            </Text>
            <Text justifySelf='end' mr='1rem'>
              {Number(balance?.USDC) * Number(balanceValue?.USDC) || '0'}$
            </Text>
          </GridBox>

          <GridBox marginTop='1dvh'>
            <Text justifySelf='start' ml='1rem'>
              MATIC
            </Text>
            <Text justifySelf='end' mr='1rem'>
              {balance?.MATIC || '0'}
            </Text>
            <Text justifySelf='end' mr='1rem'>
              {Number(balance?.MATIC) * Number(balanceValue?.MATIC) || '0'}$
            </Text>
          </GridBox>

          <Text sx={{ margin: 'auto', width: '100%', textAlign: 'center' }}>
            (*) we just display SOPHIE, USDC and MATIC Tokens
          </Text>
        </>
      ) : (
        <>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              flexDirection: 'column',
              justifyContent: 'space-between',
              margin: 'auto',
              width: '100%',
              height: '40%',
            }}
          >
            <Text>You don&#39;t have any Tokens</Text>
            <Button onClick={navigateToBuyPage}>Buy SOFI</Button>
          </Box>
        </>
      )}
    </StyledBox>
  );
};

export default DashboardPageMain;
