import chainIds from '../../constants/chainIds';
import { ReduxState } from '../../interfaces';

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
