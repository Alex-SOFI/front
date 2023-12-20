import { connectRouter } from 'connected-react-router';
import { combineReducers } from 'redux';

import walletReducer from '../ducks/wallet/slice';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default (history: any) => {
  return combineReducers({
    router: connectRouter(history),
    wallet: walletReducer,
  });
};
