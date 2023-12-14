import { FunctionComponent } from 'react';

import { Layout } from '../components';
import { ExpertPageMain } from '../components/pagesComponents';

const ExpertPage: FunctionComponent = () => {
  return <Layout main={<ExpertPageMain />} />;
};

export default ExpertPage;
