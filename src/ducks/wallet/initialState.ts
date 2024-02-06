import { WalletInfoState } from 'interfaces';

export const initialState: WalletInfoState = {
  chainId: undefined,
  error: null,
  address: '0x',
  isConnected: false,
  balance: '0',
  decimals: 0,
  isMintSelected: true,
  magicLinkAddress: '0x',
};
