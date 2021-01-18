import React from 'react';
import { StyledCarouselImage } from '../../../utils/styled';
import { CafeInfo } from '../../../utils/type';
import CarouselRow from '../CarouselRow';
import CarouselDetailImage from '../CarouselDetailImage';
import './index.css';

type CafeDetailImageCarouselProps = {
    cafe: CafeInfo;
}

const CafeDetailImageCarousel = ({cafe}: CafeDetailImageCarouselProps) => {
    return(
        <div className="detail-carousel-container">
            <CarouselRow title="Carousel">
            {cafe.imageUris.map((image, index) => {   
                return(
                    <StyledCarouselImage key={index}>
                        <CarouselDetailImage image={image}/>
                    </StyledCarouselImage>
                )
            })}
            </CarouselRow>
        </div>
    )
}

export default CafeDetailImageCarousel;