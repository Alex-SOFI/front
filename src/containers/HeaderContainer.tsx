import { FunctionComponent } from 'react';

import Header from '../components/Header';
import { noop } from '../tools';

interface HeaderContainerProps {
  isLinkOnly?: boolean;
}

const HeaderContainer: FunctionComponent<HeaderContainerProps> = ({
  isLinkOnly,
}) => {
  return <Header onClick={noop} isLinkOnly={isLinkOnly || false} />; // temporary
};

export default HeaderContainer;
