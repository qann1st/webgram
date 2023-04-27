import { createSlice } from '@reduxjs/toolkit';

export interface UsersState {
  data: Array<object> | null;
}

const initialState: UsersState = {
  data: null,
};

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    setUsersList(state, action) {
      state.data = action.payload.users;
    },
  },
});

export const { setUsersList } = usersSlice.actions;

export default usersSlice.reducer;
