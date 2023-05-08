import { Action, combineReducers, configureStore, ThunkAction } from '@reduxjs/toolkit';
import dialogsSlice from './slices/dialogsSlice';
import messagesSlice from './slices/messagesSlice';
import userReducer from './slices/userSlice';
import usersReducer from './slices/usersSlice';

const rootReducer = combineReducers({
  users: usersReducer,
  user: userReducer,
  messages: messagesSlice,
  dialogs: dialogsSlice,
});

export const store = configureStore({
  reducer: rootReducer,
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
