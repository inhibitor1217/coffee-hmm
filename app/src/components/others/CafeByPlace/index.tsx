import React from 'react';
import { TypeCafe } from '../../../utils/type';
import { StyledCarouselImage } from '../../../utils/styled';
import CarouselMainImage from '../../others/CarouselMainImage';
import CarouselHorizontal from '../../others/CarouselHorizontal';
import { useAppDispatch } from '../../../store/hooks';
import introNavSlice from '../../../store/modules/intro-nav';

type CafeByPlaceProps = {
    cafes: TypeCafe[];
    isImageReady: boolean;
    setIsImageReady: (isImageReady: boolean) => void;
}

const CafeByPlace = ({cafes, isImageReady, setIsImageReady}: CafeByPlaceProps) => {
    const dispatch = useAppDispatch();
    const setCurrentCafeIndex = (index: number) => dispatch(introNavSlice.actions.navigateToCafe(index));

    if(cafes.length === 1){
        return  <CarouselMainImage cafe={cafes[0]} isImageReady={isImageReady} setIsImageReady={setIsImageReady}/>
    }

    return(
        <CarouselHorizontal title="Carousel" setCurrentIndex={setCurrentCafeIndex}>
        {cafes?.map((cafe) => {
            return(
                <StyledCarouselImage key={cafe.id}>
                    <CarouselMainImage cafe={cafe} isImageReady={isImageReady} setIsImageReady={setIsImageReady} />
                </StyledCarouselImage>
        )})}
        </CarouselHorizontal>
    )
}

export default CafeByPlace;