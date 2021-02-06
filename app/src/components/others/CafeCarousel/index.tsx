import React from 'react';
import { TypeCafe } from '../../../utils/type';
import CarouselMainImage from '../CarouselMainImage';
import './index.css';
import CarouselVertical from '../CarouselVertical';
import { StyledCarouselImage } from '../../../utils/styled';

type CafeImageCarouselProps = {
    cafes: TypeCafe[];
}

const CafeCarousel = ({cafes}: CafeImageCarouselProps) => {
    return(
        <div className="carousel-container">
            <CarouselVertical title="Carousel">
            {cafes?.map((cafe, index) => {
                return(
                    <StyledCarouselImage key={index}>
                        <CarouselMainImage cafe={cafe}/>
                    </StyledCarouselImage>
            )})}
            </CarouselVertical>
        </div>
    )
}

export default CafeCarousel;