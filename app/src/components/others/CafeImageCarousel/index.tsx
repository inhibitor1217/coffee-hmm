import React from 'react';
import { CafeInfo } from '../../../utils/type';
import CarouselMainImage from '../CarouselMainImage';
import './index.css';
import Carousel from '../Carousel';
import { StyledCarouselImage } from '../../../utils/styled';

type CafeImageCarouselProps = {
    cafes: CafeInfo[];
    setCafe: (cafe: CafeInfo | null) => void;
}

const CafeImageCarousel = ({cafes, setCafe}: CafeImageCarouselProps) => {
    return(
        <div className="carousel-container">
            <Carousel title="Carousel">
            {cafes?.map((cafe, index) => {
                return(
                    <StyledCarouselImage key={index}>
                        <CarouselMainImage cafe={cafe} setCafe={setCafe}/>
                    </StyledCarouselImage>
            )})}
            </Carousel>
       
        </div>
    )
}

export default CafeImageCarousel;