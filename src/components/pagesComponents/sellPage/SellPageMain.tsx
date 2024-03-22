import { ChangeEvent, FunctionComponent } from 'react';

import styled from '@emotion/styled';
import Box from '@mui/material/Box';

import statusTexts from 'constants/statusTexts';

import { Button, LoadingSpinner, Text, TextInput } from 'components/basic';

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

interface SellPageMainProps {
  handleButtonClick: () => void;
  handleInputChange: (event: ChangeEvent<HTMLInputElement>) => void;
  inputValue: string;
  balance: number;
  setMaxValue: () => void;
  isMaxValueError: boolean;
  isTransactionLoading: boolean;
  isTransactionError: boolean;
  transactionErrorText: string;
}

const SellPageMain: FunctionComponent<SellPageMainProps> = ({
  handleButtonClick,
  inputValue,
  handleInputChange,
  balance,
  setMaxValue,
  isMaxValueError,
  isTransactionLoading,
  isTransactionError,
  transactionErrorText,
}) => {
  return (
    <StyledBox>
      <TextInput
        placeholder={'SOPHIE Amount to Sell'}
        textAlign='left'
        value={inputValue}
        onChange={handleInputChange}
        readOnly={isTransactionLoading}
      />

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

      <Button
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
            Sell SOPHIE
          </Text>
          {isTransactionLoading && (
            <LoadingSpinner position='relative' size='22' />
          )}
        </Box>
      </Button>
    </StyledBox>
  );
};

export default SellPageMain;
