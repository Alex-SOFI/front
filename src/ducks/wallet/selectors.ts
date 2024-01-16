import { ReduxState } from 'interfaces';

import chainIds from 'constants/chainIds';

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
    state.wallet?.chainId !== chainIds.MAINNET &&
    state.wallet?.chainId !== chainIds.TESTNET
  ) {
    return true;
  }
  return false;
};
