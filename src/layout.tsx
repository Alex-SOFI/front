import { FunctionComponent, PropsWithChildren } from 'react';
import { Navigate } from 'react-router-dom';

import { UserState } from 'interfaces';

import routes from 'constants/routes';

import { LoadingSpinner } from 'components/basic';

interface LayoutProps extends PropsWithChildren {
  isLoggedIn?: boolean | null | undefined;
  dispatchUser?: (payload: UserState) => void;
}

export const PrivateRoute: FunctionComponent<LayoutProps> = ({
  isLoggedIn,
  children,
}) => {
  if (isLoggedIn === undefined || isLoggedIn === null) {
    return <LoadingSpinner />;
  }
  return isLoggedIn ? children : <Navigate to={routes.LOGIN} replace />;
};

export const PublicRoute: FunctionComponent<LayoutProps> = ({
  isLoggedIn,
  children,
}) => {
  if (isLoggedIn === undefined || isLoggedIn === null) {
    return <LoadingSpinner />;
  }
  return isLoggedIn ? <Navigate to={routes.EXPERT} replace /> : children;
};
