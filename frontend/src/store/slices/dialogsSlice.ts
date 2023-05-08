import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface DialogsState {
  isDialogsOpened: boolean;
}

const initialState: DialogsState = {
  isDialogsOpened: true,
};

const dialogsSlice = createSlice({
  name: 'dialogs',
  initialState,
  reducers: {
    setIsDialogsOpened(state, action: PayloadAction<boolean>) {
      state.isDialogsOpened = action.payload;
    },
  },
});

export const { setIsDialogsOpened } = dialogsSlice.actions;

export default dialogsSlice.reducer;
