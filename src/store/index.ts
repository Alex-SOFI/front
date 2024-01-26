import { configureStore } from '@reduxjs/toolkit';
import { createBrowserHistory } from 'history';

import userReducer from 'ducks/user/slice';
import walletReducer from 'ducks/wallet/slice';

export const history = createBrowserHistory();

export const store = configureStore({
  reducer: {
    wallet: walletReducer,
    user: userReducer,
  },
});
