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
  handleBuyButtonClick: () => void;
  handleInputChange: (event: ChangeEvent<HTMLInputElement>) => void;
  investInputValue: string;
}

const BuyPageMain: FunctionComponent<BuyPageMainProps> = ({
  handleBuyButtonClick,
  investInputValue,
  handleInputChange,
}) => {
  return (
    <StyledBox>
      <TextInput
        placeholder='Amount to invest'
        textAlign='left'
        value={investInputValue}
        onChange={handleInputChange}
      />
      <Button
        marginTop='5dvh'
        disabled={Number(investInputValue) <= 0 || investInputValue === '.'}
        onClick={handleBuyButtonClick}
      >
        Buy SOFI
      </Button>
    </StyledBox>
  );
};

export default BuyPageMain;
