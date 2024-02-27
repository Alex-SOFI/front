import { ChangeEvent, FunctionComponent } from 'react';

import styled from '@emotion/styled';
import Box from '@mui/material/Box';

import { Button, TextInput } from 'components/basic';

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
  min-height: clamp(6rem, 9.6dvh, 6rem);

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
}

const TransfertPageMain: FunctionComponent<TransfertPageMainProps> = ({
  handleSendButtonClick,
  addressInputValue,
  handleAddressInputChange,
  amountInputValue,
  handleAmountInputChange,
  invalidAddressError,
}) => {
  return (
    <StyledBox>
      {/* <InputBox>
        <TextInput
          placeholder='Address'
          textAlign='left'
          value={addressInputValue}
          onChange={handleAddressInputChange}
        />
      </InputBox> */}
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
