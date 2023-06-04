import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IUser } from '../../utils/types';

export interface currentEnemyState {
  currentEnemy: IUser | null | undefined;
}

const initialState: currentEnemyState = {
  currentEnemy: null,
};

const currentEnemySlice = createSlice({
  name: 'currentEnemy',
  initialState,
  reducers: {
    setCurrentEnemy(state, action: PayloadAction<IUser | undefined | null>) {
      state.currentEnemy = action.payload;
    },
  },
});

export const { setCurrentEnemy } = currentEnemySlice.actions;

export default currentEnemySlice.reducer;
