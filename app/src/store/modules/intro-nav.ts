import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type IntroNavState = {
  currentPlaceIndex: number;
  currentCafeIndex: number;
};

const initialState: IntroNavState = {
  currentPlaceIndex: 0,
  currentCafeIndex: 0,
};

const introNavSlice = createSlice({
  name: 'introNav',
  initialState,
  reducers: {
    navigateToPlace(state, action: PayloadAction<number>) {
      state.currentPlaceIndex = action.payload;
      state.currentCafeIndex = 0;
    },
    navigateToCafe(state, action: PayloadAction<number>) {
      state.currentCafeIndex = action.payload;
    }
  },
});

export default introNavSlice;
