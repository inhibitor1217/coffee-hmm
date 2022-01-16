import { createSelector } from "reselect";
import { RootState } from "store";
import { Cafe, Place } from "types/common";

export const currentIntroPlaceSelector = createSelector<
  RootState,
  Place[] | undefined,
  number,
  Place | undefined
>(
  (state) => state.cafe.place?.list,
  (state) => state.introNav.currentPlaceIndex,
  (places, currentPlaceIndex) => {
    return places?.[currentPlaceIndex];
  },
);

export const currentIntroCafeListSelector = createSelector<
  RootState,
  Place | undefined,
  { [placeId: string]: { list: Cafe[] } },
  Cafe[] | undefined
>(
  currentIntroPlaceSelector,
  (state) => state.cafe.cafeMap,
  (place, cafeMap) => {
    if (!place) {
      return undefined;
    }

    return cafeMap[place.id]?.list;
  },
);

export const currentIntroCafeSelector = createSelector<
  RootState,
  Cafe[] | undefined,
  number,
  Cafe | undefined
>(
  currentIntroCafeListSelector,
  (state) => state.introNav.currentCafeIndex,
  (cafeList, currentCafeIndex) => {
    return cafeList?.[currentCafeIndex];
  },
);
