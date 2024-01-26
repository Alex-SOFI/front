/* eslint-disable no-param-reassign */
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
  },
});

const { actions, reducer } = userSlice;

export const { setUser } = actions;

export default reducer;
