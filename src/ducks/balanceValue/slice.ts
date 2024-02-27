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
          SOFI?: number;
          USDC?: number;
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
    setSofiBalanceValue(state, { payload }: { payload: number }) {
      state.sofiValue = payload;
      state.isLoading = false;
    },
    setUsdcBalanceValue(state, { payload }: { payload: number }) {
      state.usdcValue = payload;
    },
    setMaticBalanceValue(state, { payload }: { payload: number }) {
      state.maticValue = payload;
    },
    resetBalanceValue(state) {
      state.isLoading = false;
      state.sofiValue = 0;
      state.usdcValue = 0;
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
  setSofiBalanceValue,
  setUsdcBalanceValue,
  setMaticBalanceValue,
  getBalanceValueError,
  resetBalanceValue,
  resetIsLoading,
} = actions;

export default reducer;
