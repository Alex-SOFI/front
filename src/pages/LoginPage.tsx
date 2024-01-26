import { FunctionComponent, useCallback, useEffect, useState } from 'react';

import { loginUser, logoutUser } from 'service/magic';

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
    try {
      await loginUser(emailInputValue, dispatchUser);
    } catch (error) {
      setError('Unable to log in');
    }
  }, [dispatchUser, emailInputValue]);

  const logout = useCallback(async () => {
    try {
      await logoutUser(dispatchUser);
    } catch (error) {
      setError('Unable to log out');
      console.error(error);
    }
  }, [dispatchUser]);

  return (
    <Layout
      isLinkOnly
      main={
        <LoginPageMain
          emailInputValue={emailInputValue}
          setEmailInputValue={setEmailInputValue}
          login={login}
          logout={logout}
          error={error}
        />
      }
      footer={<LinksList />}
    />
  );
};

export default LoginPage;
