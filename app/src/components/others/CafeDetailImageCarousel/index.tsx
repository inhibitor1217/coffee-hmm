import React, { useState } from 'react';
import { StyledCarouselImage } from '../../../utils/styled';
import { TypeCafe } from '../../../utils/type';
import CarouselDetailImage from '../CarouselDetailImage';
import PositionDotHorizontal from '../PositionDotHorizontal';
import './index.css';
import { Axis, SwipeablePanel } from '@inhibitor1217/react-swipeablepanel';

type CafeDetailImageCarouselProps = {
    cafe: TypeCafe | null;
}

const CafeDetailImageCarousel = ({cafe}: CafeDetailImageCarouselProps) => {
    const imageNum = cafe?.image.count;
    const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);

    const cafeImageListPanel = React.useMemo(() => {
        if (!cafe) {
            return null;
        }

        if (cafe.image.list.length > 1) {
            return (
                <SwipeablePanel
                    axis={Axis.horizontal}
                    onPageChanged={setCurrentImageIndex}
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

    return(
        <div className="detail-carousel-dot-wrapper">
            <div className="detail-carousel-container">
                { cafeImageListPanel }
            </div>
            <PositionDotHorizontal dotNum={imageNum? imageNum : 0} currentIndex={currentImageIndex}/>
        </div>
       
    )
}

export default CafeDetailImageCarousel;