import { UserState, WalletInfoState } from '.';

interface ReduxState {
  wallet: WalletInfoState;
  user: UserState;
}

export default ReduxState;
