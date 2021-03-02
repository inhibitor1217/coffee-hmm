import { SwipeablePanel, Axis } from '@inhibitor1217/react-swipeablepanel';
import React, { useEffect, useMemo, useState } from 'react';
import { openSearch } from '../../../utils/function';
import { TypeCafe } from '../../../utils/type';
import { StyledCarouselImage, StyledRowFlex } from '../../../utils/styled';
import CarouselMainImage from '../../others/CarouselMainImage';
import './index.css';

type CafeByPlaceProps = {
    cafes: TypeCafe[];
}

const CafeByPlace = ({ cafes }: CafeByPlaceProps) => {
  const [cafeIndex, setCafeIndex] = useState<number>(0);

  useEffect(function resetIndexOnListChanged() {
    setCafeIndex(0);
  }, [cafes]);

  const currentCafe = cafes[Math.min(cafeIndex, cafes.length - 1)];

  /* memoize the swiping panel to ensure that DOM element executing the animation is preserved */
  const memoizedSwipeablePanel = useMemo(() => {
    const key = `TypeCafe[]#id=${cafes[0].id}`;

    return (
      <SwipeablePanel
        key={key /* ensure that SwipeablePanel is not recycled when rendering different set of cafes */}
        axis={Axis.horizontal}
        onPageChanged={setCafeIndex}
        loop
      >
        {cafes.map((cafe) => (
          <StyledCarouselImage key={cafe.id}>
            <CarouselMainImage cafe={cafe} />
          </StyledCarouselImage>
        ))}
      </SwipeablePanel>
    );
  }, [cafes]);

  return (
    <div className="carousel-container">
      <div className="cafe-preview-info">
        <h4>{currentCafe?.name}</h4>
        <span className="cafe-preview-info-list">OPEN {currentCafe?.metadata?.hour}</span>
        <span className="cafe-preview-info-by">{currentCafe.metadata?.creator || 'jyuunnii'} 님이 올려주신 {currentCafe?.name}</span>
      </div>
      <div className="cafe-preview-carousel-wrapper">
        {
          cafes && cafes.length > 1 && memoizedSwipeablePanel
        }
        {
          cafes && cafes.length === 1 && (
            <CarouselMainImage cafe={cafes[0]} />
          )
        }
      </div>
      <StyledRowFlex className="cafe-preview-websearch">
        <span onClick={() => openSearch((currentCafe?.name)+" "+currentCafe.place.name, "Naver")}>네이버 바로가기</span>
        <span onClick={() => openSearch((currentCafe?.name), "Instagram")}>인스타그램 바로가기</span>       
      </StyledRowFlex>
    </div>
  );
}

export default CafeByPlace;