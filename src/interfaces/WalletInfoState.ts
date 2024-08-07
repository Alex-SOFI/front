import { Address } from 'viem';

export interface MagicLinkBalance {
  SOPHIE?: number | null;
  USDT?: number | null;
  ETH?: number | null;
}

interface WalletInfoState {
  chainId: number | undefined;
  error: Error | null;
  address: Address;
  isConnected: boolean;
  balance: string;
  decimals: number;
  isMintSelected: boolean;
  magicLinkAddress: Address;
  magicLinkBalance: MagicLinkBalance | null;
  isMagicLinkBalanceSet: boolean;
}

export default WalletInfoState;
