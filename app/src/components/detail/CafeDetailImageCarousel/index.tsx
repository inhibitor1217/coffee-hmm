import React, { useState } from "react";

import {
  Axis,
  Duration,
  SwipeablePanel,
} from "@inhibitor1217/react-swipeablepanel";
import { StyledCarouselImage } from "utils/styled";
import { Cafe } from "types/common/model";

import PositionDotHorizontal from "components/common/PositionDotHorizontal";

import CarouselDetailImage from "../CarouselDetailImage";

import "./index.css";

type CafeDetailImageCarouselProps = {
  cafe: Cafe | null;
};

const CafeDetailImageCarousel = ({ cafe }: CafeDetailImageCarouselProps) => {
  const imageNum = cafe?.image.count;
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);

  const cafeImagePanelDetail = React.useMemo(() => {
    if (!cafe) {
      return null;
    }

    if (cafe.image.list.length > 1) {
      return (
        <SwipeablePanel
          axis={Axis.horizontal}
          onPageChanged={setCurrentImageIndex}
          auto
          autoSlideInterval={Duration.from({ seconds: 4.5 })}
          loop
        >
          {cafe.image.list.sort().map((image) => (
            <StyledCarouselImage key={image.id}>
              <CarouselDetailImage image={image.relativeUri} />
            </StyledCarouselImage>
          ))}
        </SwipeablePanel>
      );
    }

    return (
      <StyledCarouselImage>
        <CarouselDetailImage image={cafe.image.list[0].relativeUri} />
      </StyledCarouselImage>
    );
  }, [cafe]);

  return (
    <div className="detail-carousel-dot-wrapper">
      <div className="detail-carousel-container">{cafeImagePanelDetail}</div>
      <PositionDotHorizontal
        dotNum={imageNum ? imageNum : 0}
        currentIndex={currentImageIndex}
      />
    </div>
  );
};

export default CafeDetailImageCarousel;
