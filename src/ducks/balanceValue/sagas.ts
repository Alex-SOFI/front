import { all, call, put, takeLatest } from 'redux-saga/effects';
import { formatUnits, parseUnits } from 'viem';

import { publicClient, tokenManagerContract } from 'constants/contracts';

import {
  getBalanceValue,
  getBalanceValueError,
  getValue,
  setMaticBalanceValue,
  setSofiBalanceValue,
  setUsdcBalanceValue,
} from 'ducks/balanceValue';

function* getBalanceValueSaga({ payload }: ReturnType<typeof getBalanceValue>) {
  try {
    if (payload.sofi) {
      const estimateBalance = async (sofi: string) => {
        const data = await publicClient.readContract({
          ...tokenManagerContract,
          functionName: 'estimateRedeem',
          args: [parseUnits(sofi, 18)],
        });
        return formatUnits(data as bigint, 18);
      };
      const balance: string = yield call(estimateBalance, payload.sofi);
      yield put(setSofiBalanceValue(balance));
    }
    if (payload.usdc) {
      const usdcValue: string = yield call(getValue, 'USDCUSDT');
      yield put(setUsdcBalanceValue(usdcValue));
    }
    if (payload.matic) {
      const maticValue: string = yield call(getValue, 'MATICUSDT');
      yield put(setMaticBalanceValue(maticValue));
    }
  } catch (error) {
    yield put(getBalanceValueError());
  }
}

export default function* watchBalanceValue() {
  yield all([takeLatest(getBalanceValue, getBalanceValueSaga)]);
}
