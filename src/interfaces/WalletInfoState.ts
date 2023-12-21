interface WalletInfoState {
  chainId: number | undefined;
  error: Error | null;
  address: `0x${string}` | undefined;
  isConnected: boolean;
  balance: string | number | undefined;
  decimals: number;
}

export default WalletInfoState;
