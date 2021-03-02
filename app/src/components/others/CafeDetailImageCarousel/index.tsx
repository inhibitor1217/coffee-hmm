import { SwipeablePanel, Axis } from '@inhibitor1217/react-swipeablepanel';
import React, { useState, useMemo } from 'react';
import { StyledCarouselImage } from '../../../utils/styled';
import { TypeCafe } from '../../../utils/type';
import CarouselDetailImage from '../CarouselDetailImage';
import PositionDotHorizontal from '../PositionDotHorizontal';
import './index.css';

type CafeDetailImageCarouselProps = {
    cafe: TypeCafe | null;
}

const CafeDetailImageCarousel = ({cafe}: CafeDetailImageCarouselProps) => {
    const imageNum = cafe?.image.count;
    const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);

    const memoizedSwipeablePanel = useMemo(() => {
        if (!cafe) {
            return null;
        }

        if (cafe.image.list.length === 1) {
            const image = cafe.image.list[0];
            return (
                <StyledCarouselImage>
                    <CarouselDetailImage image={image.relativeUri}/>
                </StyledCarouselImage>
            );
        }

        return (
            <SwipeablePanel
                axis={Axis.horizontal}
                onPageChanged={setCurrentImageIndex}
                loop
            >
                {cafe.image.list.sort().map((image) => {   
                    return(
                        <StyledCarouselImage key={image.id}>
                            <CarouselDetailImage image={image.relativeUri}/>
                        </StyledCarouselImage>
                    )
                })}
            </SwipeablePanel>
        );
    }, [cafe]);

    return(
        <div className="detail-carousel-dot-wrapper">
            <div className="detail-carousel-container">
                {memoizedSwipeablePanel}
            </div>
            <PositionDotHorizontal dotNum={imageNum? imageNum : 0} currentIndex={currentImageIndex}/>
        </div>
       
    )
}

export default CafeDetailImageCarousel;