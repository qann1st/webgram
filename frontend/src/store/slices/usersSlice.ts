import { createSlice } from '@reduxjs/toolkit';
import { IUser } from '../../utils/types';

export interface UsersState {
  users: Array<IUser> | null;
}

const initialState: UsersState = {
  users: null,
};

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    setUsersList(state, action) {
      state.users = action.payload;
    },
  },
});

export const { setUsersList } = usersSlice.actions;

export default usersSlice.reducer;
