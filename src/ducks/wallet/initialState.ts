import { WalletInfoState } from '../../interfaces';

export const initialState: WalletInfoState = {
  isLoading: false,
  error: null,
  address: undefined,
  isConnected: false,
};
