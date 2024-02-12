import { FunctionComponent } from 'react';

import styled from '@emotion/styled';
import Box from '@mui/material/Box';

import { Button } from 'components/basic';

import { theme } from 'styles/theme';

const StyledBox = styled(Box)`
  display: flex;
  flex-direction: column;
  width: 40%;
  height: 100%;
  justify-content: space-between;
  justify-content: space-evenly;
  margin: auto;
  @media (max-width: ${theme.breakpoints.sm}) {
    width: 60%;
  }
`;

interface HomePageMainProps {
  handleEmailButtonClick: () => void;
  handleWalletButtonClick: () => void;
}

const HomePageMain: FunctionComponent<HomePageMainProps> = ({
  handleEmailButtonClick,
  handleWalletButtonClick,
}) => {
  return (
    <StyledBox>
      <Button marginTop='20%' onClick={handleEmailButtonClick}>
        E-mail signup / signin
      </Button>
      <Button marginBottom='20%' onClick={handleWalletButtonClick}>
        I use my own wallet
      </Button>
    </StyledBox>
  );
};

export default HomePageMain;
