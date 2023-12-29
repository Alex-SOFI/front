interface WalletInfoState {
  chainId: number | undefined;
  error: Error | null;
  address: `0x${string}` | undefined;
  isConnected: boolean;
  balance: string;
  decimals: number;
}

export default WalletInfoState;
