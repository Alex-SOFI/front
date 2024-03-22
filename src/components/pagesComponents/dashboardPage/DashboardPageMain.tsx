import { FunctionComponent, useMemo } from 'react';

import styled from '@emotion/styled';
import Box from '@mui/material/Box';
import { PUBLIC_URL } from 'config';

import { MagicLinkBalance } from 'interfaces/WalletInfoState';

import { Button, Picture, Text } from 'components/basic';

import { theme } from 'styles/theme';

const StyledBox = styled(Box)`
  max-width: ${theme.breakpoints.sm};
  margin: 5dvh auto 0 auto;
  width: 70%;
  height: 100%;
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

interface GridBoxProps {
  gridTemplateColumns?: string;
  width?: string;
}

const GridBox = styled(Box)<GridBoxProps>`
  display: grid;
  grid-template-columns: ${(props) =>
    props.gridTemplateColumns || 'repeat(3, 1fr)'};
  width: ${(props) => props.width || '100%'};
  align-items: center;
  justify-content: center;
`;

const BalanceText = styled(Text)`
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  text-align: right;
  width: 90%;
  justify-self: end;
`;

const TokenBox = styled(Box)`
  display: flex;
  align-items: center;
`;

interface DashboardPageMainProps {
  balance: MagicLinkBalance | null;
  balanceValue: {
    SOPHIE?: number | null;
    USDT?: number | null;
    MATIC?: number | null;
  };
  navigateToBuyPage: () => void;
  navigateToSellPage: () => void;
  navigateToSwapPage: () => void;
  isMobile: boolean;
}

const DashboardPageMain: FunctionComponent<DashboardPageMainProps> = ({
  balance,
  balanceValue,
  navigateToBuyPage,
  navigateToSellPage,
  navigateToSwapPage,
  isMobile,
}) => {
  const sellButton = useMemo(
    () => (
      <Button
        onClick={navigateToSellPage}
        margin={isMobile ? '3dvh auto 0 auto' : '0'}
        {...(!isMobile
          ? {
              minHeight: '0rem',
              padding: 0,
              justifySelf: 'start',
              marginLeft: '1rem',
              color: 'inherit',
              textColor: theme.colors.grayMedium,
              height: '120%',
              fontSize: '16px',
              lineHeight: 'inherit',
            }
          : { variant: 'outlined', isPrimaryColor: true })}
      >
        Sell{`${isMobile ? ' SOPHIE' : ''}`}
      </Button>
    ),
    [isMobile, navigateToSellPage],
  );

  const swapButton = useMemo(
    () => (
      <Button
        onClick={navigateToSwapPage}
        margin={isMobile ? '1dvh auto 0 auto' : '0'}
        {...(!isMobile
          ? {
              minHeight: '0rem',
              padding: 0,
              justifySelf: 'start',
              marginLeft: '1rem',
              height: '120%',
              width: '100%',
              fontSize: '16px',
              lineHeight: 'inherit',
            }
          : {})}
      >
        Swap {isMobile && 'USDT'} to SOPHIE
      </Button>
    ),
    [isMobile, navigateToSwapPage],
  );

  return (
    <StyledBox>
      <Text
        fontWeight={500}
        color={theme.colors.primary}
        alignSelf='start'
        mb='1rem'
      >
        Balance
      </Text>
      <GridBox>
        <Text fontWeight={500}>Tokens*</Text>
        <Text fontWeight={500} justifySelf='end'>
          Qty
        </Text>
        <Text fontWeight={500} justifySelf='end'>
          Value
        </Text>
      </GridBox>
      {balance !== null ? (
        <>
          <GridBox
            marginTop='3dvh'
            {...(!isMobile && {
              marginLeft: 'auto',
              gridTemplateColumns: 'repeat(4, 1fr)',
              width: '133.5%',
            })}
          >
            <TokenBox>
              <Picture
                src={`${PUBLIC_URL}/icons/logo_sophie.png`}
                alt='SOPHIE logo'
              />
              <Text pl='0.5rem'>SOPHIE</Text>
            </TokenBox>
            <BalanceText>
              {balance?.SOPHIE ? Number(balance?.SOPHIE.toFixed(4)) : '0'}
            </BalanceText>
            <BalanceText>
              {balance?.SOPHIE ? Number(balanceValue?.SOPHIE?.toFixed(4)) : 0}$
            </BalanceText>
            {!isMobile && sellButton}
          </GridBox>

          <GridBox
            marginTop='1dvh'
            {...(!isMobile && {
              marginLeft: 'auto',
              gridTemplateColumns: 'repeat(4, 1fr)',
              width: '133.5%',
            })}
          >
            <TokenBox>
              <Picture
                src={`${PUBLIC_URL}/icons/logo_usdt.svg`}
                alt='USDT logo'
              />
              <Text pl='0.5rem'>USDT</Text>
            </TokenBox>
            <BalanceText>
              {balance?.USDT ? Number(balance?.USDT.toFixed(4)) : '0'}
            </BalanceText>
            <BalanceText>
              {balance?.USDT && balanceValue?.USDT
                ? Number((balance?.USDT * balanceValue?.USDT).toFixed(4))
                : 0}
              $
            </BalanceText>
            {!isMobile && swapButton}
          </GridBox>

          <GridBox marginTop='1dvh'>
            <TokenBox>
              <Picture
                src={`${PUBLIC_URL}/icons/logo_matic.svg`}
                alt='MATIC logo'
              />
              <Text pl='0.5rem'>MATIC</Text>
            </TokenBox>
            <BalanceText>
              {balance?.MATIC ? Number(balance?.MATIC.toFixed(4)) : '0'}
            </BalanceText>
            <BalanceText>
              {balance?.MATIC && balanceValue?.MATIC
                ? Number((balance?.MATIC * balanceValue?.MATIC).toFixed(4))
                : '0'}
              $
            </BalanceText>
          </GridBox>

          <Text
            sx={{
              marginTop: '5dvh',
              width: '100%',
              textAlign: 'center',
            }}
          >
            (*) we just display SOPHIE, USDT and MATIC Tokens
          </Text>
        </>
      ) : (
        <Button onClick={navigateToBuyPage} marginTop='10dvh'>
          Buy SOPHIE
        </Button>
      )}
      {isMobile && balance !== null && swapButton}
      {isMobile && balance !== null && sellButton}
    </StyledBox>
  );
};

export default DashboardPageMain;
