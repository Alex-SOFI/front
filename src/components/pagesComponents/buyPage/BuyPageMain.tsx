import { ChangeEvent, FunctionComponent } from 'react';

import styled from '@emotion/styled';
import Box from '@mui/material/Box';

import statusTexts from 'constants/statusTexts';

import { Button, Text, TextInput } from 'components/basic';

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
  balance?: number;
  setMaxValue?: () => void;
  isMaxValueError?: boolean;
}

const BuyPageMain: FunctionComponent<BuyPageMainProps> = ({
  handleButtonClick,
  inputValue,
  handleInputChange,
  isSellPage,
  balance,
  setMaxValue,
  isMaxValueError,
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
                {statusTexts.MAX_SOFI_VALUE}
              </Text>
            )}
          </Box>
        </>
      )}
      <Button
        marginTop={isSellPage ? '1dvh' : '10dvh'}
        disabled={
          Number(inputValue) <= 0 || inputValue === '.' || isMaxValueError
        }
        onClick={handleButtonClick}
      >
        {isSellPage ? 'Sell SOFI' : 'Buy SOFI'}
      </Button>
    </StyledBox>
  );
};

export default BuyPageMain;
