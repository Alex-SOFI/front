import { FunctionComponent } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

import routes from 'constants/routes';

import { LoadingSpinner } from 'components/basic';

const OauthPage: FunctionComponent = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  if (!searchParams.has('provider')) {
    navigate(routes.EXPERT, { replace: true });
  }

  return <LoadingSpinner />;
};

export default OauthPage;
