import { FunctionComponent } from 'react';

import { Layout } from '../components';
import {
  ExpertPageLinksBlock,
  ExpertPageMain,
} from '../components/pagesComponents/expertPage';

const ExpertPage: FunctionComponent = () => {
  return <Layout main={<ExpertPageMain />} footer={<ExpertPageLinksBlock />} />;
};

export default ExpertPage;
