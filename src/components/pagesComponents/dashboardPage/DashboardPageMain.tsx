import { FunctionComponent, useEffect, useState } from 'react';

import styled from '@emotion/styled';
import Box from '@mui/material/Box';
import { useWindowWidth } from 'hooks';

import { MagicLinkBalance } from 'interfaces/WalletInfoState';

import { Button, Text } from 'components/basic';

import { theme } from 'styles/theme';

const StyledBox = styled(Box)`
  max-width: ${theme.breakpoints.sm};
  margin: 10dvh auto 0 auto;
  width: 70%;
  display: flex;
  align-items: center;
  flex-direction: column;
  @media (max-width: ${theme.breakpoints.xs}) {
    margin: 4dvh auto 0 auto;
    width: 90%;
  }
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
    SOFI?: number | null;
    USDC?: number | null;
    MATIC?: number | null;
  };
  navigateToBuyPage: () => void;
}

const DashboardPageMain: FunctionComponent<DashboardPageMainProps> = ({
  balance,
  balanceValue,
  navigateToBuyPage,
}) => {
  const width = useWindowWidth();
  const [isMobile, setIsMobile] = useState<boolean>(window.innerWidth < 640);
  useEffect(() => {
    if (width < 640) {
      setIsMobile(true);
    } else {
      setIsMobile(false);
    }
  }, [width]);
  return (
    <StyledBox>
      <Text
        fontWeight={500}
        color={theme.colors.primary}
        alignSelf='start'
        ml='1rem'
        mb='1rem'
      >
        Balance
      </Text>
      <GridBox>
        <Text fontWeight={500} justifySelf='start' ml='1rem'>
          Tokens*
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
              {balance?.SOFI ? Number(balance?.SOFI.toFixed(4)) : '0'}
            </Text>
            <Text justifySelf='end' mr='1rem'>
              {balance?.SOFI ? Number(balanceValue?.SOFI?.toFixed(4)) : 0}$
            </Text>
          </GridBox>

          <GridBox marginTop='1dvh'>
            <Text justifySelf='start' ml='1rem'>
              USDC
            </Text>
            <Text justifySelf='end' mr='1rem'>
              {balance?.USDC ? Number(balance?.USDC.toFixed(4)) : '0'}
            </Text>
            <Text justifySelf='end' mr='1rem'>
              {balance?.USDC && balanceValue?.USDC
                ? Number((balance?.USDC * balanceValue?.USDC).toFixed(4))
                : 0}
              $
            </Text>
          </GridBox>

          <GridBox marginTop='1dvh'>
            <Text justifySelf='start' ml='1rem'>
              MATIC
            </Text>
            <Text justifySelf='end' mr='1rem'>
              {balance?.MATIC ? Number(balance?.MATIC.toFixed(4)) : '0'}
            </Text>
            <Text justifySelf='end' mr='1rem'>
              {balance?.MATIC && balanceValue?.MATIC
                ? Number((balance?.MATIC * balanceValue?.MATIC).toFixed(4))
                : '0'}
              $
            </Text>
          </GridBox>

          <Text
            sx={{
              marginTop: '5dvh',
              width: '100%',
              textAlign: 'center',
            }}
          >
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
      <Button margin='0 auto'>Sell{`${isMobile ? ' SOPHIE' : ''}`}</Button>
    </StyledBox>
  );
};

export default DashboardPageMain;
