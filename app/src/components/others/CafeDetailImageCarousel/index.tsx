import React from 'react';
import { StyledCarouselImage } from '../../../utils/styled';
import { CafeInfo } from '../../../utils/type';
import CarouselHorizontal from '../CarouselHorizontal';
import CarouselDetailImage from '../CarouselDetailImage';
import './index.css';

type CafeDetailImageCarouselProps = {
    cafe: CafeInfo;
}

const CafeDetailImageCarousel = ({cafe}: CafeDetailImageCarouselProps) => {
    return(
        <div className="detail-carousel-container">
            <CarouselHorizontal title="Carousel">
            {cafe.imageUris.map((image, index) => {   
                return(
                    <StyledCarouselImage key={index}>
                        <CarouselDetailImage image={image}/>
                    </StyledCarouselImage>
                )
            })}
            </CarouselHorizontal>
        </div>
    )
}

export default CafeDetailImageCarousel;