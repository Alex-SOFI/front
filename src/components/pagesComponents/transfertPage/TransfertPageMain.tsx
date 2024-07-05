import { ChangeEvent, FunctionComponent } from 'react';

import styled from '@emotion/styled';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import { SelectChangeEvent } from '@mui/material/Select';

import statusTexts from 'constants/statusTexts';
import { TOKEN_NAMES } from 'constants/textConstants';

import {
  Button,
  LoadingSpinner,
  Select,
  Text,
  TextInput,
} from 'components/basic';

import { theme } from 'styles/theme';

const StyledBox = styled(Box)`
  display: flex;
  flex-direction: column;
  width: 100%;
  align-items: center;
  justify-content: center;
  margin: 5dvh auto 0 auto;
  @media (max-width: ${theme.breakpoints.sm}) {
    width: 80%;
  }
`;

const InputBox = styled(Box)`
  width: 50%;
  min-height: clamp(5rem, 9dvh, 5rem);
  display: flex;
  flex-direction: column;

  @media (max-width: ${theme.breakpoints.sm}) {
    width: 100%;
  }
`;

interface TransfertPageMainProps {
  handleSendButtonClick: () => void;
  handleAddressInputChange: (event: ChangeEvent<HTMLInputElement>) => void;
  addressInputValue: string;
  handleAmountInputChange: (event: ChangeEvent<HTMLInputElement>) => void;
  amountInputValue: string;
  invalidAddressError: boolean;
  tokenInputValue: string;
  handleTokenInputChange: (event: SelectChangeEvent) => void;
  isMaxValueError: boolean;
  isTransactionLoading: boolean;
  isTransactionError: boolean;
  transactionErrorText: string;
  setMaxValue: () => void;
  balance: number;
}

const TransfertPageMain: FunctionComponent<TransfertPageMainProps> = ({
  handleSendButtonClick,
  addressInputValue,
  handleAddressInputChange,
  amountInputValue,
  handleAmountInputChange,
  invalidAddressError,
  tokenInputValue,
  handleTokenInputChange,
  isMaxValueError,
  isTransactionLoading,
  isTransactionError,
  transactionErrorText,
  setMaxValue,
  balance,
}) => {
  return (
    <StyledBox>
      <InputBox mb='1.5em'>
        <InputLabel
          sx={{ fontSize: '16px', color: theme.colors.black }}
          id='select_token'
        >
          Choose Token to Transfert
        </InputLabel>
        <Select
          labelId='select_token'
          placeholder='Address'
          textAlign='left'
          value={tokenInputValue}
          onChange={handleTokenInputChange}
          readOnly={isTransactionLoading}
        >
          <MenuItem value={TOKEN_NAMES.SOPHIE}>SOPHIE</MenuItem>
          <MenuItem value={TOKEN_NAMES.USDT}>USDT</MenuItem>
        </Select>
      </InputBox>
      <InputBox>
        <TextInput
          placeholder='Address'
          textAlign='left'
          value={addressInputValue}
          onChange={handleAddressInputChange}
          readOnly={isTransactionLoading}
          {...(invalidAddressError
            ? { helperText: 'Enter valid address' }
            : {})}
        />
      </InputBox>
      <InputBox>
        <TextInput
          placeholder='Amount'
          textAlign='left'
          value={amountInputValue}
          onChange={handleAmountInputChange}
          readOnly={isTransactionLoading}
        />
        <Button
          variant='text'
          onClick={setMaxValue!}
          fontSize='14px'
          textColor={theme.colors.grayMedium}
          minHeight='0rem'
          lineHeight={1.5}
          textAlign='right'
          alignSelf='end'
          minWidth='0'
        >
          Max: {Number(balance?.toFixed(5))}
        </Button>
      </InputBox>

      <Text fontSize={16} textAlign='center' width='100%' variant='body2'>
        ⚠️ This transaction is on the Arbitrum Blockchain, and you cannot
        reverse it when completed.
      </Text>

      <Box
        sx={(theme) => ({
          marginTop: '1dvh',
          minHeight: 'clamp(3rem, 6.4dvh, 4rem)',
          [theme.breakpoints.down('sm')]: {
            textAlign: 'center',
            marginBottom: '0.5rem',
          },
        })}
      >
        {isMaxValueError && (
          <Text
            textAlign='center'
            width='100%'
            variant='body2'
            color={theme.colors.error}
          >
            {tokenInputValue === TOKEN_NAMES.SOPHIE
              ? statusTexts.MAX_SOPHIE_VALUE
              : statusTexts.MAX_USDT_VALUE}
          </Text>
        )}
        {isTransactionError && (
          <Text textAlign='center' variant='body2' color={theme.colors.error}>
            {transactionErrorText}
          </Text>
        )}
      </Box>

      <Button
        disabled={
          !addressInputValue ||
          invalidAddressError ||
          !amountInputValue ||
          isTransactionLoading
        }
        onClick={handleSendButtonClick}
      >
        <Box display='flex' justifyContent='space-between' alignItems='center'>
          <Text color='inherit' fontWeight={500} mr='0.15rem'>
            Send Transaction
          </Text>
          {isTransactionLoading && (
            <LoadingSpinner position='relative' size='22' />
          )}
        </Box>
      </Button>
    </StyledBox>
  );
};

export default TransfertPageMain;
