import { BalanceValueState, UserState, WalletInfoState } from '.';

interface ReduxState {
  wallet: WalletInfoState;
  user: UserState;
  balance: BalanceValueState;
}

export default ReduxState;
