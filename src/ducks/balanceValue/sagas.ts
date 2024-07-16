import { all, call, put, takeLatest } from 'redux-saga/effects';
import { formatUnits, parseUnits } from 'viem';

import { publicClient, tokenManagerContract } from 'constants/contracts';

import {
  getBalanceValue,
  getBalanceValueError,
  getValue,
  resetIsLoading,
  setEthBalanceValue,
  setSophieBalanceValue,
  setUsdtBalanceValue,
} from 'ducks/balanceValue';

function* getBalanceValueSaga({ payload }: ReturnType<typeof getBalanceValue>) {
  try {
    const {
      tether: { usd },
    } = yield call(getValue, 'tether', 'USD');

    const {
      ethereum: { usd: ethUsd },
    } = yield call(getValue, 'ethereum', 'USD');

    if (payload?.SOPHIE) {
      const estimateBalance = async (sophie: number) => {
        const data = await publicClient.readContract({
          ...tokenManagerContract,
          functionName: 'previewRedeem',
          args: [parseUnits(sophie.toString(), 18)],
        });
        return Number(formatUnits(data as bigint, 18));
      };
      const balance: number = yield call(estimateBalance, payload?.SOPHIE);
      yield put(setSophieBalanceValue(balance * usd * ethUsd));
    }
    if (payload?.USDT) {
      yield put(setUsdtBalanceValue(usd));
    }
    if (payload?.ETH) {
      const {
        maticNetwork: { usd },
      } = yield call(getValue, 'matic-network', 'USD');
      yield put(setEthBalanceValue(usd));
    }
    yield put(resetIsLoading());
  } catch (error) {
    yield put(getBalanceValueError());
  }
}

export default function* watchBalanceValue() {
  yield all([takeLatest(getBalanceValue, getBalanceValueSaga)]);
}
