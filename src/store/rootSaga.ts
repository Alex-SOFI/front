import { fork } from 'redux-saga/effects';

import watchBalanceValue from 'ducks/balanceValue/sagas';

export default function* rootSaga() {
  yield fork(watchBalanceValue);
}
