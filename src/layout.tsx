import {
  FunctionComponent,
  PropsWithChildren,
  ReactNode,
  Suspense,
} from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

import { useIsUserConnected } from 'hooks';

import routes from 'constants/routes';

import { selectWalletInfo } from 'ducks/wallet';

import { LoadingSpinner } from 'components/basic';

interface LayoutProps extends PropsWithChildren {
  isLoggedIn?: boolean | null | undefined;
  userHasWallet?: boolean;
}

const elementWithSuspense = (element: ReactNode) => (
  <Suspense fallback={<LoadingSpinner />}>{element}</Suspense>
);

export const HomeRoute: FunctionComponent<LayoutProps> = ({ children }) => {
  const { userConnectedWithMagicLink, userConnectedWithWallet } =
    useIsUserConnected();
  if (!userConnectedWithMagicLink && !userConnectedWithWallet) {
    return elementWithSuspense(children);
  }
  if (userConnectedWithWallet) {
    return <Navigate to={routes.EXPERT} replace />;
  }

  if (userConnectedWithMagicLink) {
    return <Navigate to={routes.MAIN} replace />;
  }
};

export const PrivateRoute: FunctionComponent<LayoutProps> = ({
  isLoggedIn,
  children,
}) => {
  const { magicLinkAddress } = useSelector(selectWalletInfo);
  const { userConnectedWithMagicLink, userConnectedWithWallet } =
    useIsUserConnected();
  switch (true) {
    case userConnectedWithWallet:
      return <Navigate to={routes.EXPERT} replace />;

    case userConnectedWithMagicLink &&
      (isLoggedIn === undefined || isLoggedIn === null):
    case userConnectedWithMagicLink && isLoggedIn && magicLinkAddress === '0x':
      return <LoadingSpinner />;

    case userConnectedWithMagicLink && isLoggedIn:
      return elementWithSuspense(children);

    case !userConnectedWithMagicLink && !isLoggedIn:
      return <Navigate to={routes.HOME} replace />;

    default:
      return null;
  }
};

export const PublicRoute: FunctionComponent<LayoutProps> = ({
  isLoggedIn,
  children,
}) => {
  const { userConnectedWithMagicLink, userConnectedWithWallet } =
    useIsUserConnected();
  switch (true) {
    case userConnectedWithWallet:
      return <Navigate to={routes.EXPERT} replace />;

    case userConnectedWithMagicLink &&
      (isLoggedIn === undefined || isLoggedIn === null):
      return <LoadingSpinner />;

    case isLoggedIn:
      return <Navigate to={routes.MAIN} replace />;

    case !isLoggedIn:
      return elementWithSuspense(children);

    default:
      return null;
  }
};

export const WalletRoute: FunctionComponent<LayoutProps> = ({ children }) => {
  const { userConnectedWithMagicLink } = useIsUserConnected();
  if (userConnectedWithMagicLink) {
    return <Navigate to={routes.MAIN} replace />;
  }
  return elementWithSuspense(children);
};
