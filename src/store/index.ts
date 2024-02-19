import { configureStore } from '@reduxjs/toolkit';
import { createBrowserHistory } from 'history';
import createSagaMiddleware from 'redux-saga';
import rootSaga from 'store/rootSaga';

import balanceReducer from 'ducks/balanceValue/slice';
import userReducer from 'ducks/user/slice';
import walletReducer from 'ducks/wallet/slice';

export const history = createBrowserHistory();
const sagaMiddleware = createSagaMiddleware();

export const store = configureStore({
  reducer: {
    wallet: walletReducer,
    user: userReducer,
    balance: balanceReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ thunk: false }).concat(sagaMiddleware),
});

sagaMiddleware.run(rootSaga);
