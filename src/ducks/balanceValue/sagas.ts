import { all, call, put, takeLatest } from 'redux-saga/effects';
import { formatUnits, parseUnits } from 'viem';

import { publicClient, tokenManagerContract } from 'constants/contracts';

import {
  getBalanceValue,
  getBalanceValueError,
  getValue,
  resetIsLoading,
  setMaticBalanceValue,
  setSofiBalanceValue,
  setUsdcBalanceValue,
} from 'ducks/balanceValue';

function* getBalanceValueSaga({ payload }: ReturnType<typeof getBalanceValue>) {
  try {
    if (payload?.SOFI) {
      const estimateBalance = async (sofi: number) => {
        const data = await publicClient.readContract({
          ...tokenManagerContract,
          functionName: 'estimateRedeem',
          args: [parseUnits(sofi.toString(), 18)],
        });
        return Number(formatUnits(data as bigint, 18));
      };
      const balance: number = yield call(estimateBalance, payload?.SOFI);
      yield put(setSofiBalanceValue(balance));
    }
    if (payload?.USDC) {
      const {
        usdCoin: { usd },
      } = yield call(getValue, 'usd-coin', 'USD');
      yield put(setUsdcBalanceValue(usd));
    }
    if (payload?.MATIC) {
      const {
        maticNetwork: { usd },
      } = yield call(getValue, 'matic-network', 'USD');
      yield put(setMaticBalanceValue(usd));
    }
    yield put(resetIsLoading());
  } catch (error) {
    yield put(getBalanceValueError());
  }
}

export default function* watchBalanceValue() {
  yield all([takeLatest(getBalanceValue, getBalanceValueSaga)]);
}
