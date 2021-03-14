import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type IntroNavState = {
  currentPlaceIndex: number;
  currentCafeIndex: number;
  isInitialCafeImageReady: boolean;
};

const initialState: IntroNavState = {
  currentPlaceIndex: 0,
  currentCafeIndex: 0,
  isInitialCafeImageReady: false,
};

const introNavSlice = createSlice({
  name: 'introNav',
  initialState,
  reducers: {
    navigateToPlace(state, action: PayloadAction<number>) {
      state.isInitialCafeImageReady = false;
      state.currentPlaceIndex = action.payload;
      state.currentCafeIndex = 0;
    },
    navigateToCafe(state, action: PayloadAction<number>) {
      state.currentCafeIndex = action.payload;
    },
    setImageReady(state, action: PayloadAction<number>) {
      if(action.payload === 0) {
        state.isInitialCafeImageReady = true;
      }
    }
  },
});

export default introNavSlice;
