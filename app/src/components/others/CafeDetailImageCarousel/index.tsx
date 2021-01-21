import React, { useContext, useEffect, useState } from 'react';
import { StyledCarouselImage } from '../../../utils/styled';
import { CafeInfo } from '../../../utils/type';
import CarouselHorizontal from '../CarouselHorizontal';
import CarouselDetailImage from '../CarouselDetailImage';
import PositionDotHorizontal from '../PositionDotHorizontal';
import './index.css';
import { CarouselIndexCtx } from '../../../context';

type CafeDetailImageCarouselProps = {
    cafe: CafeInfo | null;
}

const CafeDetailImageCarousel = ({cafe}: CafeDetailImageCarouselProps) => {
    const [images, setImages] = useState<string[]>([]);
    const { carouselIndexCtx } = useContext(CarouselIndexCtx);
    const imageNum = cafe?.imageUris.length;

    useEffect(() => {
        setImages(cafe?.imageUris || []);
    },[cafe?.imageUris])
    
    return(
        <div className="detail-carousel-dot-wrapper">
            <div className="detail-carousel-container">
                <CarouselHorizontal title="Carousel">
                {images.sort().map((image, index) => {   
                    return(
                        <StyledCarouselImage key={index}>
                            <CarouselDetailImage image={image}/>
                        </StyledCarouselImage>
                    )
                })}
                </CarouselHorizontal>
            </div>
            <PositionDotHorizontal dotNum={imageNum || 0} currentIndex={carouselIndexCtx}/>
        </div>
       
    )
}

export default CafeDetailImageCarousel;