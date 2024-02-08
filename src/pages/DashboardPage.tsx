import { FunctionComponent } from 'react';

import { DashboardPageMain } from 'components/pagesComponents/dashboardPage';

import { Layout } from 'components';

const DashboardPage: FunctionComponent = () => {
  return <Layout main={<DashboardPageMain balance={null} /* temporary */ />} />;
};

export default DashboardPage;
