import { createSlice } from '@reduxjs/toolkit';
import { IUser } from '../../utils/types';

export interface UsersState {
  user: IUser | null;
  isAuth: any;
}

const initialState: UsersState = {
  user: null,
  isAuth: false,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser(state, action) {
      state.user = action.payload;
      state.isAuth = true;
    },
    removeUser(state) {
      state.user = null;
      state.isAuth = false;
    },
  },
});

export const { setUser, removeUser } = userSlice.actions;

export default userSlice.reducer;
