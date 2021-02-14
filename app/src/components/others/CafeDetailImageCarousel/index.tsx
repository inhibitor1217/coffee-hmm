import React, { useState } from 'react';
import { StyledCarouselImage } from '../../../utils/styled';
import { TypeCafe } from '../../../utils/type';
import CarouselHorizontal from '../CarouselHorizontal';
import CarouselDetailImage from '../CarouselDetailImage';
import PositionDotHorizontal from '../PositionDotHorizontal';
import './index.css';

type CafeDetailImageCarouselProps = {
    cafe: TypeCafe | null;
}

const CafeDetailImageCarousel = ({cafe}: CafeDetailImageCarouselProps) => {
    const imageNum = cafe?.image.count;
    const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);

    return(
        <div className="detail-carousel-dot-wrapper">
            <div className="detail-carousel-container">
                <CarouselHorizontal title="Carousel" setCurrentIndex={setCurrentImageIndex}>
                {cafe?.image.list.sort().map((image) => {   
                    return(
                        <StyledCarouselImage key={image.id}>
                            <CarouselDetailImage image={image.relativeUri}/>
                        </StyledCarouselImage>
                    )
                })}
                </CarouselHorizontal>
            </div>
            <PositionDotHorizontal dotNum={imageNum? imageNum : 0} currentIndex={currentImageIndex}/>
        </div>
       
    )
}

export default CafeDetailImageCarousel;