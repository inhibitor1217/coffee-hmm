import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { Cafe, Place } from "types/common";
import { RootState } from "store";
import { DataAlreadyLoadedException } from "store/exception";
import { getCafeListByPlace, getPlaceList } from "api";

type CafeState = {
  place?: {
    list: Place[];
  };
  cafeMap: {
    [placeId: string]: {
      list: Cafe[];
    };
  };
};

const initialState: CafeState = {
  cafeMap: {},
};

export const fetchPlaces = createAsyncThunk<
  Place[],
  void,
  { state: RootState }
>("cafe/fetchPlaces", async (_, { getState }) => {
  if (getState().cafe.place) {
    throw new DataAlreadyLoadedException();
  }

  const response = await getPlaceList();
  return response.place.list;
});

export const fetchCafesByPlace = createAsyncThunk<
  { placeId: string; list: Cafe[] },
  Place,
  { state: RootState }
>("cafe/fetchCafesByPlace", async (place: Place, { getState }) => {
  const cafeRecord = getState().cafe.cafeMap[place.id];
  if (cafeRecord) {
    throw new DataAlreadyLoadedException();
  }

  const response = await getCafeListByPlace(place.name);
  return {
    placeId: place.id,
    list: response.cafe.list,
  };
});

const cafeSlice = createSlice({
  name: "cafe",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchPlaces.fulfilled, (state, action) => {
      state.place = { list: action.payload };
    });

    builder.addCase(fetchCafesByPlace.fulfilled, (state, action) => {
      state.cafeMap[action.payload.placeId] = {
        list: action.payload.list,
      };
    });
  },
});

export default cafeSlice;
