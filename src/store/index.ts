import { configureStore } from '@reduxjs/toolkit';
import { createBrowserHistory } from 'history';

import walletReducer from 'ducks/wallet/slice';

export const history = createBrowserHistory();

export const store = configureStore({
  reducer: {
    wallet: walletReducer,
  },
});
