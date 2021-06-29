import React from "react";

import {
  Axis,
  Duration,
  SwipeablePanel,
} from "@inhibitor1217/react-swipeablepanel";
import { useAppDispatch, useAppSelector } from "store/hooks";
import introNavSlice from "store/modules/intro-nav";
import {
  currentIntroCafeListSelector,
  currentIntroPlaceSelector,
} from "store/selectors/cafe";
import { StyledCarouselImage } from "utils/styled";

import CarouselMainImage from "../CarouselMainImage";

const CafeMainImageCarousel: React.FC = () => {
  const dispatch = useAppDispatch();
  const currentPlace = useAppSelector(currentIntroPlaceSelector);
  const currentCafeIndex = useAppSelector(
    (state) => state.introNav.currentCafeIndex
  );

  const setCurrentCafeIndex = React.useCallback(
    (index: number) => dispatch(introNavSlice.actions.navigateToCafe(index)),
    [dispatch],
  );

  const cafeList = useAppSelector(currentIntroCafeListSelector);

  const carousel = React.useMemo(() => {
    if (!cafeList) return null;

    if (cafeList.length > 1) {
      return (
        <SwipeablePanel
          key={currentPlace?.id ?? ""}
          axis={Axis.horizontal}
          initialPage={currentCafeIndex}
          onPageChanged={setCurrentCafeIndex}
          auto
          autoSlideInterval={Duration.from({ seconds: 4.5 })}
          loop
        >
          {cafeList?.map((cafe, index) => (
            <StyledCarouselImage key={cafe.id}>
              <CarouselMainImage cafe={cafe} index={index} />
            </StyledCarouselImage>
          ))}
        </SwipeablePanel>
      );
    }

    return <CarouselMainImage cafe={cafeList[0]} index={0} />;
    // NOTE: (@inhibitor1217) [currentCafeIndex] 를 deps에 포함하지 않습니다.
    //       "place"가 업데이트 될 때에만 cafeListPanel 을 다시 그립니다.
    //       currentCafeIndex 수정 시 cafeListPanel 이 업데이트되면,
    //       애니메이션이 정상적으로 실행되지 않습니다.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPlace, cafeList, setCurrentCafeIndex]);

  return carousel;
};

export default CafeMainImageCarousel;
