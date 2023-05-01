import { createSlice } from '@reduxjs/toolkit';
import { IUser } from '../../utils/types';

export interface UsersState {
  data: IUser | null;
}

const initialState: UsersState = {
  data: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser(state, action) {
      state.data = action.payload;
    },
  },
});

export const { setUser } = userSlice.actions;

export default userSlice.reducer;
