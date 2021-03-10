import React, { useState } from 'react';
import { TypeCafe } from '../../../utils/type';
import CarouselMainImage from '../CarouselMainImage';
import './index.css';
import CarouselVertical from '../CarouselVertical';
import { StyledCarouselImage } from '../../../utils/styled';

type CafeImageCarouselProps = {
    cafes: TypeCafe[];
}

const CafeCarousel = ({cafes}: CafeImageCarouselProps) => {
    const [isImageReady, setIsImageReady] = useState<boolean>(false);

    if(cafes.length === 1) {
        return (
            <div>
                <StyledCarouselImage>
                    <CarouselMainImage cafe={cafes[0]} isImageReady={isImageReady} setIsImageReady={setIsImageReady}/>
                </StyledCarouselImage>
            </div>
        )
    }
    return(
        <div className="carousel-container">
            <CarouselVertical title="Carousel">
            {cafes?.map((cafe) => {
                return(
                    <StyledCarouselImage key={cafe.id}>
                        <CarouselMainImage cafe={cafe} isImageReady={isImageReady} setIsImageReady={setIsImageReady}/>
                    </StyledCarouselImage>
            )})}
            </CarouselVertical>
        </div>
    )
}

export default CafeCarousel;