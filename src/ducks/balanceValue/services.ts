import apiRoutes from 'constants/apiRoutes';

import request from 'tools/requests';

export const getValue = (symbol: string) =>
  request.get(apiRoutes.AVG_PRICE, { params: { symbol } });
