import { Address } from 'viem';

export interface MagicLinkBalance {
  SOFI?: number | null;
  USDC?: number | null;
  MATIC?: number | null;
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
