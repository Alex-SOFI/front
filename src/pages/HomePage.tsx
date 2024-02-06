import { FunctionComponent, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

import routes from 'constants/routes';

import setHasWallet from 'tools/setHasWallet';

import { HomePageMain } from 'components/pagesComponents/homePage';

import { Layout } from 'components';

const DashboardPage: FunctionComponent = () => {
  const navigate = useNavigate();

  const handleEmailButtonClick = useCallback(() => {
    setHasWallet('false');
    navigate(routes.LOGIN, { replace: true });
  }, [navigate]);

  const handleWalletButtonClick = useCallback(() => {
    setHasWallet('true');
    navigate(routes.EXPERT, { replace: true });
  }, [navigate]);

  return (
    <Layout
      isLinkOnly
      main={
        <HomePageMain
          handleEmailButtonClick={handleEmailButtonClick}
          handleWalletButtonClick={handleWalletButtonClick}
        />
      }
    />
  );
};

export default DashboardPage;
