import { ChangeEvent, FunctionComponent, useMemo } from 'react';

import styled from '@emotion/styled';
import Box from '@mui/material/Box';
import { PUBLIC_URL } from 'config';

import statusTexts from 'constants/statusTexts';

import {
  Button,
  LoadingSpinner,
  Picture,
  Text,
  TextInput,
} from 'components/basic';

import { theme } from 'styles/theme';

const StyledBox = styled(Box)`
  display: flex;
  flex-direction: column;
  width: 40%;
  align-items: center;
  justify-content: center;
  margin: 5dvh auto 0 auto;
  @media (max-width: ${theme.breakpoints.sm}) {
    width: 60%;
  }
`;

interface BuyPageMainProps {
  handleButtonClick: () => void;
  handleInputChange: (event: ChangeEvent<HTMLInputElement>) => void;
  inputValue: string;
  isSellPage: boolean;
  balance?: number;
  setMaxValue?: () => void;
  isMaxValueError?: boolean;
  hasAllownace?: boolean;
  isTransactionLoading?: boolean;
  isTransactionError?: boolean;
  transactionErrorText?: string;
}

const BuyPageMain: FunctionComponent<BuyPageMainProps> = ({
  handleButtonClick,
  inputValue,
  handleInputChange,
  isSellPage,
  balance,
  setMaxValue,
  isMaxValueError,
  hasAllownace,
  isTransactionLoading,
  isTransactionError,
  transactionErrorText,
}) => {
  const buttonText = useMemo(() => {
    if (isSellPage) {
      if (hasAllownace) {
        return 'Sell SOPHIE';
      } else {
        return 'Approve SOPHIE';
      }
    } else {
      return 'Buy SOPHIE';
    }
  }, [hasAllownace, isSellPage]);
  return (
    <StyledBox>
      <TextInput
        placeholder={
          isSellPage ? 'SOPHIE Amount to Sell' : 'USD Amount to Invest'
        }
        textAlign='left'
        value={inputValue}
        onChange={handleInputChange}
        readOnly={isTransactionLoading}
      />
      {isSellPage && (
        <>
          <Button
            variant='text'
            onClick={setMaxValue!}
            fontSize='14px'
            textColor={theme.colors.grayMedium}
            minHeight='0rem'
            lineHeight={1.5}
            alignSelf='end'
            textAlign='right'
            minWidth='0'
          >
            Max: {Number(balance?.toFixed(5))}
          </Button>
          <Box
            sx={{
              marginTop: '1dvh',
              minHeight: 'clamp(3rem, 6.4dvh, 4rem)',
              alignSelf: 'start',
            }}
          >
            {isMaxValueError && (
              <Text
                sx={{ gridColumn: 2 }}
                variant='body2'
                color={theme.colors.error}
              >
                {statusTexts.MAX_SOPHIE_VALUE}
              </Text>
            )}
            {isTransactionError && (
              <Text
                sx={{ gridColumn: 2 }}
                variant='body2'
                color={theme.colors.error}
              >
                {transactionErrorText}
              </Text>
            )}
          </Box>
        </>
      )}
      <Button
        marginTop={isSellPage ? '1dvh' : '10dvh'}
        disabled={
          Number(inputValue) <= 0 ||
          inputValue === '.' ||
          isMaxValueError ||
          isTransactionLoading
        }
        onClick={handleButtonClick}
      >
        <Box display='flex' justifyContent='space-between' alignItems='center'>
          <Text color='inherit' fontWeight={500} mr='0.15rem'>
            {buttonText}
          </Text>
          {isTransactionLoading && (
            <LoadingSpinner position='relative' size='22' />
          )}
        </Box>
      </Button>
      {!isSellPage && (
        <Box display='flex' alignItems='center' mt='0.3rem'>
          <Text mr='0.5rem' fontSize='16px'>
            With
          </Text>
          <Picture
            src={`${PUBLIC_URL}/icons/logo_transak.svg`}
            alt='MATIC logo'
            width={90}
            height={30}
          />
        </Box>
      )}
    </StyledBox>
  );
};

export default BuyPageMain;
