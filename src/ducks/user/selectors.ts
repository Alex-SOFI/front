import { ReduxState } from 'interfaces';

export const selectUser = (state: ReduxState) => state.user;
export const selectIsUserLoading = (state: ReduxState) => state.user.isLoading;
