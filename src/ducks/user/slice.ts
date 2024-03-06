import { createSlice } from '@reduxjs/toolkit';

import { UserState } from 'interfaces';

import { initialState } from '.';

const name = 'user';

export const userSlice = createSlice({
  name,
  initialState,
  reducers: {
    setUser(state, { payload }: { payload: UserState }) {
      state.isLoggedIn = payload.isLoggedIn;
      state.email = payload.email;
    },
    setIsUserLoading(state, { payload }: { payload: boolean }) {
      state.isLoading = payload;
    },
  },
});

const { actions, reducer } = userSlice;

export const { setUser, setIsUserLoading } = actions;

export default reducer;
