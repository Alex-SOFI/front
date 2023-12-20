import { WalletInfoState } from '../../interfaces';

export const initialState: WalletInfoState = {
  chainId: undefined,
  error: null,
  address: undefined,
  isConnected: false,
  balance: 0,
};
