import { FunctionComponent, useCallback, useEffect, useState } from 'react';

import useMagic from 'hooks/useMagic';

import { UserState } from 'interfaces';

import { emailRegex } from 'constants/regex';

import LinksList from 'components/pagesComponents/LinksList';
import LoginPageMain from 'components/pagesComponents/loginPage/LoginPageMain';

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

  const loginUserWithGoogle = useCallback(async () => {
    try {
      await oauthLogin();
    } catch (error) {
      setError('Unable to log in');
      console.error(error);
    }
  }, [oauthLogin]);

  return (
    <Layout
      isLinkOnly
      main={
        <LoginPageMain
          emailInputValue={emailInputValue}
          setEmailInputValue={setEmailInputValue}
          login={login}
          loginWithGoogle={loginUserWithGoogle}
          error={error}
        />
      }
      footer={<LinksList />}
    />
  );
};

export default LoginPage;
