import { createSelector } from "reselect";
import { RootState } from "store";
import { TypeCafe, TypePlace } from "types";

export const currentIntroPlaceSelector = createSelector<
  RootState,
  TypePlace[] | undefined,
  number,
  TypePlace | undefined
>(
  (state) => state.cafe.place?.list,
  (state) => state.introNav.currentPlaceIndex,
  (places, currentPlaceIndex) => {
    return places?.[currentPlaceIndex];
  },
);

export const currentIntroCafeListSelector = createSelector<
  RootState,
  TypePlace | undefined,
  { [placeId: string]: { list: TypeCafe[] } },
  TypeCafe[] | undefined
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
  TypeCafe[] | undefined,
  number,
  TypeCafe | undefined
>(
  currentIntroCafeListSelector,
  (state) => state.introNav.currentCafeIndex,
  (cafeList, currentCafeIndex) => {
    return cafeList?.[currentCafeIndex];
  },
);
