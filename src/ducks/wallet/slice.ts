import { createSlice } from '@reduxjs/toolkit';
import { Address } from 'viem';

import { MagicLinkBalance } from 'interfaces/WalletInfoState';

import { initialState } from '.';

const name = 'wallet';

export const walletSlice = createSlice({
  name,
  initialState,
  reducers: {
    storeWalletInfo(
      state,
      {
        payload,
      }: {
        payload: {
          chainId: number | undefined;
          error: Error | null;
          address: Address;
          isConnected: boolean;
          balance: string;
          decimals: number;
        };
      },
    ) {
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
    setMagicLinkBalance(
      state,
      {
        payload,
      }: {
        payload: MagicLinkBalance;
      },
    ) {
      state.magicLinkBalance = payload;
      state.isMagicLinkBalanceSet = true;
    },
    resetMagicLinkBalance(state) {
      state.magicLinkBalance = {
        SOFI: null,
        USDC: null,
        MATIC: null,
      };
      state.isMagicLinkBalanceSet = false;
    },
  },
});

const { actions, reducer } = walletSlice;

export const {
  storeWalletInfo,
  changeMintState,
  storeMagicLinkAddress,
  resetMagicLinkAddress,
  setMagicLinkBalance,
  resetMagicLinkBalance,
} = actions;

export default reducer;
