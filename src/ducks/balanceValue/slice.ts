import { createSlice } from '@reduxjs/toolkit';

import { initialState } from '.';

const name = 'balance';
export const balanceSlice = createSlice({
  name,
  initialState,
  reducers: {
    getBalanceValue(
      state,
      {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        payload,
      }: {
        payload: {
          SOPHIE?: number;
          USDT?: number;
          MATIC?: number;
        };
      },
    ) {
      state.isLoading = true;
    },
    getBalanceValueError(state) {
      state.isLoading = false;
      state.error = true;
    },
    setSophieBalanceValue(state, { payload }: { payload: number }) {
      state.sophieValue = payload;
      state.isLoading = false;
    },
    setUsdtBalanceValue(state, { payload }: { payload: number }) {
      state.usdtValue = payload;
    },
    setMaticBalanceValue(state, { payload }: { payload: number }) {
      state.maticValue = payload;
    },
    resetBalanceValue(state) {
      state.isLoading = false;
      state.sophieValue = 0;
      state.usdtValue = 0;
      state.maticValue = 0;
      state.error = false;
    },
    resetIsLoading(state) {
      state.isLoading = false;
    },
  },
});

const { actions, reducer } = balanceSlice;

export const {
  getBalanceValue,
  setSophieBalanceValue,
  setUsdtBalanceValue,
  setMaticBalanceValue,
  getBalanceValueError,
  resetBalanceValue,
  resetIsLoading,
} = actions;

export default reducer;
