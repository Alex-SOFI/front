import { FunctionComponent, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

import routes from 'constants/routes';

import { HomePageMain } from 'components/pagesComponents/homePage';

import { Layout } from 'components';

const DashboardPage: FunctionComponent = () => {
  const navigate = useNavigate();

  const handleEmailButtonClick = useCallback(() => {
    navigate(routes.LOGIN);
  }, [navigate]);

  const handleWalletButtonClick = useCallback(() => {
    navigate(routes.EXPERT);
  }, [navigate]);

  return (
    <Layout
      isLinkOnly
      alwaysShowMarketingClaim
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
