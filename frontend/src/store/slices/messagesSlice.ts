import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IMessage } from '../../utils/types';

export interface UsersState {
  messages: IMessage[];
}

const initialState: UsersState = {
  messages: [],
};

const messagesSlice = createSlice({
  name: 'messages',
  initialState,
  reducers: {
    setMessages(state, action: PayloadAction<IMessage[]>) {
      state.messages = action.payload;
    },
    addMessage(state, action) {
      state.messages = [...state.messages, action.payload];
    },
  },
});

export const { setMessages, addMessage } = messagesSlice.actions;

export default messagesSlice.reducer;
