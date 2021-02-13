import React, { useEffect, useState } from 'react';
import { StyledCarouselImage } from '../../../utils/styled';
import { TypeCafe, TypeCafeImage } from '../../../utils/type';
import CarouselHorizontal from '../CarouselHorizontal';
import CarouselDetailImage from '../CarouselDetailImage';
import PositionDotHorizontal from '../PositionDotHorizontal';
import './index.css';

type CafeDetailImageCarouselProps = {
    cafe: TypeCafe | null;
}

const CafeDetailImageCarousel = ({cafe}: CafeDetailImageCarouselProps) => {
    const [images, setImages] = useState<TypeCafeImage[]>([]);
    const imageNum = cafe?.image.count;

    useEffect(() => {
        setImages(cafe?.image.list || []);
    },[cafe?.image.list])

    return(
        <div className="detail-carousel-dot-wrapper">
            <div className="detail-carousel-container">
                <CarouselHorizontal title="Carousel">
                {images.sort().map((image, index) => {   
                    return(
                        <StyledCarouselImage key={index}>
                            <CarouselDetailImage image={image.relativeUri}/>
                        </StyledCarouselImage>
                    )
                })}
                </CarouselHorizontal>
            </div>
            <PositionDotHorizontal dotNum={imageNum? imageNum : 0}/>
        </div>
       
    )
}

export default CafeDetailImageCarousel;