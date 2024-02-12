import { FunctionComponent, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

import routes from 'constants/routes';

import { DashboardPageMain } from 'components/pagesComponents/dashboardPage';

import { Layout } from 'components';

const DashboardPage: FunctionComponent = () => {
  const navigate = useNavigate();

  const navigateToBuyPage = useCallback(() => {
    navigate(routes.BUY);
  }, [navigate]);

  return (
    <Layout
      main={
        <DashboardPageMain
          balance={null}
          navigateToBuyPage={navigateToBuyPage} /* temporary */
        />
      }
    />
  );
};

export default DashboardPage;
