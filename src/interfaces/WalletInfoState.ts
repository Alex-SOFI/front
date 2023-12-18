interface WalletInfoState {
  chainId: number | undefined;
  error: Error | null;
  address: `0x${string}` | undefined;
  isConnected: boolean;
}

export default WalletInfoState;
