import React, { useContext } from 'react';
import { StyledCarouselImage } from '../../../utils/styled';
import { CafeInfo } from '../../../utils/type';
import CarouselHorizontal from '../CarouselHorizontal';
import CarouselDetailImage from '../CarouselDetailImage';
import PositionDotHorizontal from '../PositionDotHorizontal';
import './index.css';
import { CarouselIndexCtx } from '../../../context';

type CafeDetailImageCarouselProps = {
    cafe: CafeInfo;
}

const CafeDetailImageCarousel = ({cafe}: CafeDetailImageCarouselProps) => {
    const { carouselIndexCtx } = useContext(CarouselIndexCtx);
    const imageNum = cafe.imageUris.length;

    return(
        <div className="detail-carousel-dot-wrapper">
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
            <PositionDotHorizontal dotNum={imageNum} currentIndex={carouselIndexCtx}/>
        </div>
       
    )
}

export default CafeDetailImageCarousel;