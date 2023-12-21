/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';

import { initialState } from '.';
import { WalletInfoState } from '../../interfaces';

const name = 'wallet';

export const walletSlice = createSlice({
  name,
  initialState,
  reducers: {
    storeWalletInfo(state, { payload }: { payload: WalletInfoState }) {
      state.address = payload.address;
      state.error = payload.error;
      state.isConnected = payload.isConnected;
      state.chainId = payload.chainId;
      state.balance = payload.balance;
      state.decimals = payload.decimals;
    },
  },
});

const { actions, reducer } = walletSlice;

export const { storeWalletInfo } = actions;

export default reducer;
