import {
  FunctionComponent,
  PropsWithChildren,
  useEffect,
  useState,
} from 'react';
import { Navigate, useSearchParams } from 'react-router-dom';

import { magic } from 'service/magic';

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
  dispatchUser,
}) => {
  const [searchParams] = useSearchParams();

  const [userInfo, setUserInfo] = useState<{
    isLoggedIn: boolean | null | undefined;
    email: string | null;
  } | null>(null);

  useEffect(() => {
    if (dispatchUser) {
      if (userInfo) {
        dispatchUser(userInfo);
      }
      if (searchParams.has('provider') && !userInfo) {
        const finishLoginWithGoogle = async () => {
          try {
            const result = await magic.oauth.getRedirectResult();

            setUserInfo({
              isLoggedIn: !!result.magic?.userMetadata?.email,
              email: result?.magic?.userMetadata.email,
            });
          } catch (err) {
            console.error(err);
          }
        };
        finishLoginWithGoogle();
      }
    }
  }, [dispatchUser, searchParams, userInfo]);

  if (searchParams.has('provider') && !userInfo) {
    return <LoadingSpinner />;
  }
  if (
    !searchParams.has('provider') &&
    (isLoggedIn === undefined || isLoggedIn === null)
  ) {
    return <LoadingSpinner />;
  }
  return !searchParams.has('provider') && isLoggedIn ? (
    children
  ) : (
    <Navigate to={routes.LOGIN} replace />
  );
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
