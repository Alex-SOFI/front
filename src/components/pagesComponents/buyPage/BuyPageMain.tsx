import { ChangeEvent, FunctionComponent } from 'react';

import styled from '@emotion/styled';
import Box from '@mui/material/Box';
import { PUBLIC_URL } from 'config';

import statusTexts from 'constants/statusTexts';

import { Button, Picture, Text, TextInput } from 'components/basic';

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
  usdtInputValue: string;
  handleUsdtInputChange: (event: ChangeEvent<HTMLInputElement>) => void;
  sophieInputValue: string;
  handleSophieInputChange: (event: ChangeEvent<HTMLInputElement>) => void;
  isTransactionSuccess: boolean;
}

const BuyPageMain: FunctionComponent<BuyPageMainProps> = ({
  handleButtonClick,
  usdtInputValue,
  handleUsdtInputChange,
  sophieInputValue,
  handleSophieInputChange,
  isTransactionSuccess,
}) => {
  return (
    <StyledBox>
      <TextInput
        placeholder={'SOPHIE Shares'}
        textAlign='left'
        value={sophieInputValue}
        onChange={handleSophieInputChange}
      />
      <TextInput
        placeholder={'Amount to Invest'}
        textAlign='left'
        value={usdtInputValue}
        onChange={handleUsdtInputChange}
      />
      {
        <>
          <Box
            sx={{
              marginTop: '1dvh',
              minHeight: 'clamp(3rem, 6.4dvh, 4rem)',
              alignSelf: 'start',
            }}
          >
            {isTransactionSuccess && (
              <Text
                sx={{ gridColumn: 2 }}
                variant='body2'
                color={theme.colors.success}
              >
                {statusTexts.TRANSACTION_SUCCESSFUL}
              </Text>
            )}
          </Box>
        </>
      }
      <Button
        disabled={Number(usdtInputValue) <= 0 || usdtInputValue === '.'}
        onClick={handleButtonClick}
      >
        <Box display='flex' justifyContent='space-between' alignItems='center'>
          <Text color='inherit' fontWeight={500} mr='0.15rem'>
            Buy SOPHIE
          </Text>
        </Box>
      </Button>
      {
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
      }
    </StyledBox>
  );
};

export default BuyPageMain;
