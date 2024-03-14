import { Dispatch, FunctionComponent, MouseEvent, SetStateAction } from 'react';

import Box from '@mui/material/Box';

import { noop } from 'tools';

import { Button, Text, TextInput } from 'components/basic';

import { theme } from 'styles/theme';

interface LoginPageMainProps {
  emailInputValue: string;
  setEmailInputValue: Dispatch<SetStateAction<string>>;
  login: () => Promise<void>;
  loginWithGoogle: (event: MouseEvent<HTMLElement>) => Promise<void>;
  error: string | null;
}

const LoginPageMain: FunctionComponent<LoginPageMainProps> = ({
  emailInputValue,
  setEmailInputValue,
  login,
  loginWithGoogle,
  error,
}) => {
  return (
    <Box
      sx={(muiTheme) => ({
        maxWidth: theme.breakpoints.sm,
        paddingTop: theme.space.sm,
        paddingVottom: theme.space.sm,
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column',
        justifyContent: 'center',
        gap: 'clamp(0.5rem, 1.6dvh, 1rem)',
        margin: '5dvh auto 0 auto',
        width: '50%',
        [muiTheme.breakpoints.down('sm')]: {
          width: '70%',
        },
      })}
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
      <Button
        fullWidth
        onClickWithEvent={(event: MouseEvent<HTMLElement>) =>
          loginWithGoogle(event)
        }
        onClick={noop}
      >
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
