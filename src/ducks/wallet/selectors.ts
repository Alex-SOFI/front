import { ReduxState } from 'interfaces';

import chainIds from 'constants/chainIds';

export const selectWalletInfo = (state: ReduxState) => state.wallet;
export const selectIsWrongNetwork = (state: ReduxState) => {
  if (!state.wallet?.chainId) {
    return false;
  }
  if (
    state.wallet?.chainId !== chainIds.MAINNET &&
    state.wallet?.chainId !== chainIds.TESTNET
  ) {
    return true;
  }
  return false;
};
