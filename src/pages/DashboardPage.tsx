import { FunctionComponent } from 'react';

import { DashboardPageMain } from 'components/pagesComponents/dashboardPage';

import { Layout } from 'components';

const DashboardPage: FunctionComponent = () => {
  return <Layout isLinkOnly main={<DashboardPageMain />} />;
};

export default DashboardPage;
