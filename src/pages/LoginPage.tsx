import { FunctionComponent, useCallback, useEffect, useState } from 'react';

import { loginUser, loginWithGoogle } from 'service/magic';

import { UserState } from 'interfaces';

import { emailRegex } from 'constants/regex';

import LinksList from 'components/pagesComponents/LinksList';
import LoginPageMain from 'components/pagesComponents/loginPage/LoginPageMain';

import { Layout } from 'components';

interface LoginPageProps {
  dispatchUser: (payload: UserState) => void;
}

const LoginPage: FunctionComponent<LoginPageProps> = ({ dispatchUser }) => {
  const [emailInputValue, setEmailInputValue] = useState<string>('');

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setError(null);
  }, [emailInputValue]);

  const login = useCallback(async () => {
    if (!emailInputValue.match(emailRegex)) {
      setError('Email is Invalid');
      return;
    }
    await loginUser(emailInputValue, dispatchUser, setError);
  }, [dispatchUser, emailInputValue]);

  const loginUserWithGoogle = useCallback(async () => {
    try {
      await loginWithGoogle();
    } catch (error) {
      setError('Unable to log in');
      console.error(error);
    }
  }, []);

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
