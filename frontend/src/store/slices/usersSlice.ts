import { createSlice } from '@reduxjs/toolkit';

export interface UserState {
  data: Array<object> | null;
}

const initialState: UserState = {
  data: null,
};

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    setUsersList(state, action) {
      state.data = action.payload;
    },
  },
});

export const { setUsersList } = usersSlice.actions;

export default usersSlice.reducer;
