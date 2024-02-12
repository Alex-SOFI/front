import {
  FunctionComponent,
  PropsWithChildren,
  ReactNode,
  Suspense,
} from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

import { useHasWallet } from 'hooks';

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
  const userHasWallet = useHasWallet();
  if (userHasWallet === null) {
    return elementWithSuspense(children);
  }
  return userHasWallet ? (
    <Navigate to={routes.EXPERT} replace />
  ) : (
    <Navigate to={routes.LOGIN} replace />
  );
};

export const PrivateRoute: FunctionComponent<LayoutProps> = ({
  isLoggedIn,
  children,
}) => {
  const { magicLinkAddress } = useSelector(selectWalletInfo);
  const userHasWallet = useHasWallet();
  switch (true) {
    case userHasWallet === null:
      return <Navigate to={routes.HOME} replace />;

    case userHasWallet:
      return <Navigate to={routes.EXPERT} replace />;

    case !userHasWallet && (isLoggedIn === undefined || isLoggedIn === null):
    case magicLinkAddress === '0x':
      return <LoadingSpinner />;

    case !userHasWallet && isLoggedIn:
      return elementWithSuspense(children);

    case !userHasWallet && !isLoggedIn:
      return <Navigate to={routes.LOGIN} replace />;

    default:
      return null;
  }
};

export const PublicRoute: FunctionComponent<LayoutProps> = ({
  isLoggedIn,
  children,
}) => {
  const userHasWallet = useHasWallet();
  switch (true) {
    case userHasWallet === null:
      return <Navigate to={routes.HOME} replace />;

    case userHasWallet:
      return <Navigate to={routes.EXPERT} replace />;

    case !userHasWallet && (isLoggedIn === undefined || isLoggedIn === null):
      return <LoadingSpinner />;

    case !userHasWallet && isLoggedIn:
      return <Navigate to={routes.MAIN} replace />;

    case !userHasWallet && !isLoggedIn:
      return elementWithSuspense(children);

    default:
      return null;
  }
};

export const WalletRoute: FunctionComponent<LayoutProps> = ({ children }) => {
  const userHasWallet = useHasWallet();
  if (userHasWallet === null) {
    return <Navigate to={routes.HOME} replace />;
  }
  return userHasWallet ? (
    elementWithSuspense(children)
  ) : (
    <Navigate to={routes.LOGIN} replace />
  );
};
