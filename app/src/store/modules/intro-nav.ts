import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type IntroNavState = {
  currentPlaceIndex: number;
  currentCafeIndex: number;
  isInitialCafeImageReady: boolean;
  hasInitialClick: boolean;
};

const initialState: IntroNavState = {
  currentPlaceIndex: 0,
  currentCafeIndex: 0,
  isInitialCafeImageReady: false,
  hasInitialClick: false,
};

const introNavSlice = createSlice({
  name: 'introNav',
  initialState,
  reducers: {
    navigateToPlace(state, action: PayloadAction<number>) {
      state.hasInitialClick = true;
      state.currentPlaceIndex = action.payload;
      state.currentCafeIndex = 0;
    },
    navigateToCafe(state, action: PayloadAction<number>) {
      state.currentCafeIndex = action.payload;
    },
    setImageReady(state, action: PayloadAction<number>) {
      if(action.payload === initialState.currentCafeIndex) {
        state.isInitialCafeImageReady = true;
      }
    }
  },
});

export default introNavSlice;
