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
    if(cafes.length === 1) {
        return (
            <div>
                <StyledCarouselImage>
                    <CarouselMainImage cafe={cafes[0]} index={0} />
                </StyledCarouselImage>
            </div>
        )
    }
    return(
        <div className="carousel-container">
            <CarouselVertical title="Carousel">
            {cafes?.map((cafe, index) => {
                return(
                    <StyledCarouselImage key={cafe.id}>
                        <CarouselMainImage cafe={cafe} index={index}/>
                    </StyledCarouselImage>
            )})}
            </CarouselVertical>
        </div>
    )
}

export default CafeCarousel;