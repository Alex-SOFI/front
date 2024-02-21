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
          SOFI?: string;
          USDC?: string;
          MATIC?: string;
        };
      },
    ) {
      state.isLoading = true;
    },
    getBalanceValueError(state) {
      state.isLoading = false;
      state.error = true;
    },
    setSofiBalanceValue(state, { payload }: { payload: string }) {
      state.sofiValue = payload;
      state.isLoading = false;
    },
    setUsdcBalanceValue(state, { payload }: { payload: string }) {
      state.usdcValue = payload;
    },
    setMaticBalanceValue(state, { payload }: { payload: string }) {
      state.maticValue = payload;
    },
    resetBalanceValue(state) {
      state.isLoading = false;
      state.sofiValue = '0';
      state.usdcValue = '0';
      state.maticValue = '0';
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
