import { FunctionComponent } from 'react';

import Header from '../components/Header';
import { noop } from '../tools';

const HeaderContainer: FunctionComponent = () => {
  return <Header onClick={noop} />; // temporary
};

export default HeaderContainer;
