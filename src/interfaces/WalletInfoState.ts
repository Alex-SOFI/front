import { Address } from 'viem';

interface WalletInfoState {
  chainId: number | undefined;
  error: Error | null;
  address: Address;
  isConnected: boolean;
  balance: string;
  decimals: number;
  isMintSelected?: boolean;
}

export default WalletInfoState;
