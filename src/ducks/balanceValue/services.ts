import apiRoutes from 'constants/apiRoutes';

import request from 'tools/requests';

export const getValue = (ids: string, vsCurrencies: string) =>
  request.get(apiRoutes.PRICE, {
    params: { ids, ['vs_currencies']: vsCurrencies },
  });
