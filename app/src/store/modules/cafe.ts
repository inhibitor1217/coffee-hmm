import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from '..';
import { getCafeListByPlace, getPlaceList } from '../../components/api';
import { TypeCafe, TypePlace } from '../../utils/type';
import { DataAlreadyLoadedException } from '../exception';

type CafeState = {
  place?: {
    list: TypePlace[];
  };
  cafeMap: {
    [placeId: string]: {
      list: TypeCafe[];
    };
  };
};

const initialState: CafeState = {
  cafeMap: {},
};

export const fetchPlaces = createAsyncThunk<
  TypePlace[],
  void,
  { state: RootState }
>('cafe/fetchPlaces', async (_, { getState }) => {
  if (getState().cafe.place) {
    throw new DataAlreadyLoadedException();
  }

  const response = await getPlaceList();
  return response.place.list;
});

export const fetchCafesByPlace = createAsyncThunk<
  { placeId: string; list: TypeCafe[] },
  TypePlace,
  { state: RootState }
>('cafe/fetchCafesByPlace', async (place: TypePlace, { getState }) => {
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
