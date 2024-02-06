/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';
import { Address } from 'viem';

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
    storeMagicLinkAddress(state, { payload }: { payload: Address }) {
      state.magicLinkAddress = payload;
    },
    resetMagicLinkAddress(state) {
      state.magicLinkAddress = '0x';
    },
  },
});

const { actions, reducer } = walletSlice;

export const {
  storeWalletInfo,
  changeMintState,
  storeMagicLinkAddress,
  resetMagicLinkAddress,
} = actions;

export default reducer;
