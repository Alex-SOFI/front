import { ReduxState } from 'interfaces';

export const selectWalletInfo = (state: ReduxState) => state.wallet;
export const selectIsMintSelected = (state: ReduxState) =>
  state.wallet.isMintSelected;
export const selectIsWrongNetwork = (state: ReduxState) => {
  if (!state.wallet?.isConnected) {
    return false;
  }
  if (state.wallet?.isConnected && !state.wallet?.chainId) {
    return true;
  }
  if (
    state.wallet?.isConnected &&
    state.wallet?.chainId !== Number(import.meta.env.VITE_POLYGON_CHAIN_ID)
  ) {
    return true;
  }
  return false;
};
