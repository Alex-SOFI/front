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
  margin: 35% auto;
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
      <Button onClick={handleEmailButtonClick}>E-mail signup / signin</Button>
      <Button onClick={handleWalletButtonClick}>I use my own wallet</Button>
    </StyledBox>
  );
};

export default HomePageMain;
