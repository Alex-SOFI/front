import {
  FunctionComponent,
  MouseEvent,
  useCallback,
  useEffect,
  useState,
} from 'react';

import { useMagic } from 'hooks';

import { UserState } from 'interfaces';

import { emailRegex } from 'constants/regex';

import { LoginPageMain } from 'components/pagesComponents/loginPage';

import { Layout } from 'components';

interface LoginPageProps {
  dispatchUser: (payload: UserState) => void;
}

const LoginPage: FunctionComponent<LoginPageProps> = () => {
  const [emailInputValue, setEmailInputValue] = useState<string>('');

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setError(null);
  }, [emailInputValue]);

  const { loginUser, oauthLogin } = useMagic(window.location.pathname);

  const login = useCallback(async () => {
    if (!emailInputValue.match(emailRegex)) {
      setError('Email is Invalid');
      return;
    }
    await loginUser(emailInputValue, setError);
  }, [emailInputValue, loginUser]);

  const loginUserWithGoogle = useCallback(
    async (event: MouseEvent<HTMLElement>) => {
      try {
        await oauthLogin(event);
      } catch (error) {
        setError('Unable to log in');
        console.error(error);
      }
    },
    [oauthLogin],
  );

  return (
    <Layout
      isLinkOnly
      alwaysShowMarketingClaim
      main={
        <LoginPageMain
          emailInputValue={emailInputValue}
          setEmailInputValue={setEmailInputValue}
          login={login}
          loginWithGoogle={loginUserWithGoogle}
          error={error}
        />
      }
    />
  );
};

export default LoginPage;
