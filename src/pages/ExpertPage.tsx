import { FunctionComponent } from 'react';

import { Layout } from '../components';
import {
  ExpertPageLinksBlock,
  ExpertPageMain,
} from '../components/pagesComponents/expertPage';

/* interface ExpertPageProps {
  connect: () => void;
}
 */
const ExpertPage: FunctionComponent /* <ExpertPageProps> */ =
  (/* { connect } */) => {
    return (
      <Layout
        main={<ExpertPageMain /* connect={connect} */ />}
        footer={<ExpertPageLinksBlock />}
      />
    );
  };

export default ExpertPage;
