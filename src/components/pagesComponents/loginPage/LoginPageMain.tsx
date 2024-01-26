import { Dispatch, FunctionComponent, SetStateAction } from 'react';

import Box from '@mui/material/Box';

import { Button, Text, TextInput } from 'components/basic';

import { theme } from 'styles/theme';

interface LoginPageMainProps {
  emailInputValue: string;
  setEmailInputValue: Dispatch<SetStateAction<string>>;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  error: string | null;
}

const LoginPageMain: FunctionComponent<LoginPageMainProps> = ({
  emailInputValue,
  setEmailInputValue,
  login,
  logout,
  error,
}) => {
  return (
    <Box
      sx={{
        maxWidth: theme.breakpoints.sm,
        paddingTop: theme.space.sm,
        paddingVottom: theme.space.sm,
        width: '50%',
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column',
        justifyContent: 'center',
        gap: 'clamp(0.5rem, 1.6dvh, 1rem)',
        margin: '10% auto 0 auto',
      }}
    >
      <Text color='primary' fontWeight={500} alignSelf='start'>
        Login
      </Text>
      <TextInput
        placeholder='Email'
        value={emailInputValue}
        onChange={(e) => setEmailInputValue(e.target.value)}
        textAlign='start'
      />
      <Button
        fullWidth
        onClick={login}
        disabled={!emailInputValue}
        mb='clamp(0.5rem, 3.2dvh, 2rem)'
      >
        Signup / Login
      </Button>
      <Button fullWidth onClick={logout}>
        Continue with Google
      </Button>
      <Box
        sx={{
          width: '100%',
          minHeight: 'clamp(3rem, 6.4dvh, 4rem)',
        }}
      >
        {error && (
          <Text variant='body2' color={theme.colors.error}>
            {error}
          </Text>
        )}
      </Box>
    </Box>
  );
};

export default LoginPageMain;
