import { ChangeEvent, FunctionComponent } from 'react';

import styled from '@emotion/styled';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import { SelectChangeEvent } from '@mui/material/Select';

import { TOKEN_NAMES } from 'constants/textConstants';

import { Button, Select, TextInput } from 'components/basic';

import { theme } from 'styles/theme';

const StyledBox = styled(Box)`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  align-items: center;
  justify-content: center;
  margin: auto;
  @media (max-width: ${theme.breakpoints.sm}) {
    width: 60%;
  }
`;

const InputBox = styled(Box)`
  width: 50%;
  min-height: clamp(5rem, 9dvh, 5rem);

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
        >
          <MenuItem value={TOKEN_NAMES.SOFI}>SOFI</MenuItem>
          <MenuItem value={TOKEN_NAMES.USDC}>USDC</MenuItem>
        </Select>
      </InputBox>
      <InputBox>
        <TextInput
          placeholder='Address'
          textAlign='left'
          value={addressInputValue}
          onChange={handleAddressInputChange}
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
        />
      </InputBox>
      <Button
        disabled={
          !addressInputValue || invalidAddressError || !amountInputValue
        }
        onClick={handleSendButtonClick}
      >
        Send Transaction
      </Button>
    </StyledBox>
  );
};

export default TransfertPageMain;
