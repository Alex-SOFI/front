/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';

import { WalletInfoState } from 'interfaces';

import { initialState } from '.';

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
    changeMintState(state, { payload }: { payload: boolean }) {
      state.isMintSelected = payload;
    },
  },
});

const { actions, reducer } = walletSlice;

export const { storeWalletInfo, changeMintState } = actions;

export default reducer;
