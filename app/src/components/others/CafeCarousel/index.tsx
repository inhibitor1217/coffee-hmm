import React from 'react';
import { CafeInfo } from '../../../utils/type';
import CarouselMainImage from '../CarouselMainImage';
import './index.css';
import CarouselCol from '../CarouselCol';
import { StyledCarouselImage } from '../../../utils/styled';

type CafeImageCarouselProps = {
    cafes: CafeInfo[];
    setCafe: (cafe: CafeInfo | null) => void;
}

const CafeCarousel = ({cafes, setCafe}: CafeImageCarouselProps) => {
    return(
        <div className="carousel-container">
            <CarouselCol title="Carousel">
            {cafes?.map((cafe, index) => {
                return(
                    <StyledCarouselImage key={index}>
                        <CarouselMainImage cafe={cafe} setCafe={setCafe}/>
                    </StyledCarouselImage>
            )})}
            </CarouselCol>
       
        </div>
    )
}

export default CafeCarousel;