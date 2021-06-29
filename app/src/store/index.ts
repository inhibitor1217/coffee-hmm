import { configureStore } from "@reduxjs/toolkit";
import cafeSlice from "./modules/cafe";
import introNavSlice from "./modules/intro-nav";

const store = configureStore({
  reducer: {
    introNav: introNavSlice.reducer,
    cafe: cafeSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
