import { FunctionComponent } from 'react';

import { HomePageMain } from 'components/pagesComponents/homePage';

import { Layout } from 'components';

const DashboardPage: FunctionComponent = () => {
  return <Layout isLinkOnly main={<HomePageMain />} />;
};

export default DashboardPage;
