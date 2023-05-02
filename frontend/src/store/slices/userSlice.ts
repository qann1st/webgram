import { createSlice } from '@reduxjs/toolkit';
import { IUser } from '../../utils/types';

export interface UsersState {
  user: IUser | null;
}

const initialState: UsersState = {
  user: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser(state, action) {
      state.user = action.payload;
    },
  },
});

export const { setUser } = userSlice.actions;

export default userSlice.reducer;
