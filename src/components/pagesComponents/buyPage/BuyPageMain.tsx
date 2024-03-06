import { ChangeEvent, FunctionComponent } from 'react';

import styled from '@emotion/styled';
import Box from '@mui/material/Box';

import { Button, TextInput } from 'components/basic';

import { theme } from 'styles/theme';

const StyledBox = styled(Box)`
  display: flex;
  flex-direction: column;
  width: 40%;
  height: 100%;
  align-items: center;
  justify-content: center;
  margin: auto;
  @media (max-width: ${theme.breakpoints.sm}) {
    width: 60%;
  }
`;

interface BuyPageMainProps {
  handleButtonClick: () => void;
  handleInputChange: (event: ChangeEvent<HTMLInputElement>) => void;
  inputValue: string;
  isSellPage: boolean;
}

const BuyPageMain: FunctionComponent<BuyPageMainProps> = ({
  handleButtonClick,
  inputValue,
  handleInputChange,
  isSellPage,
}) => {
  return (
    <StyledBox>
      <TextInput
        placeholder={
          isSellPage ? 'SOFI Amount to Sell' : 'USD Amount to Invest'
        }
        textAlign='left'
        value={inputValue}
        onChange={handleInputChange}
      />
      <Button
        marginTop='5dvh'
        disabled={Number(inputValue) <= 0 || inputValue === '.'}
        onClick={handleButtonClick}
      >
        {isSellPage ? 'Sell SOFI' : 'Buy SOFI'}
      </Button>
    </StyledBox>
  );
};

export default BuyPageMain;
