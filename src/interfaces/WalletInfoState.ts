interface WalletInfoState {
  isLoading: boolean;
  error: Error | null;
  address: `0x${string}` | undefined;
  isConnected: boolean;
}

export default WalletInfoState;
