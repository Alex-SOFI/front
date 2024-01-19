import { FunctionComponent } from 'react';

import LinksList from 'components/pagesComponents/LinksList';

import { Layout } from 'components';

const LoginPage: FunctionComponent = () => {
  return (
    <Layout
      isLinkOnly
      main={
        <></>
        /* <LoginPageMain /> */
      }
      footer={<LinksList />}
    />
  );
};

export default LoginPage;
