import { Address } from 'viem';

export interface MagicLinkBalance {
  SOFI?: string | null;
  USDC?: string | null;
  MATIC?: string | null;
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
