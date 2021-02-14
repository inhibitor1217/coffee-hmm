import React, { useEffect, useRef } from 'react';
import { TypeCafe } from '../../../utils/type';
import { StyledCarouselImage } from '../../../utils/styled';
import CarouselMainImage from '../../others/CarouselMainImage';
import CarouselHorizontal from '../../others/CarouselHorizontal';

type CafeByPlaceProps = {
    cafes: TypeCafe[];
    setCurrentCafeIndex: (index: number) => void;
}

const CafeByPlace = ({cafes, setCurrentCafeIndex}: CafeByPlaceProps) => {
    const ref = useRef<number>(0);

    useEffect(() => {
        if(cafes.length === 1){
            setCurrentCafeIndex(0);
        }
    }, [cafes.length, setCurrentCafeIndex])

    if(cafes.length === 1){
        return  <CarouselMainImage cafe={cafes[0]}/>
    }

    return(
        <CarouselHorizontal title="Carousel" setCurrentIndex={setCurrentCafeIndex} ref={ref}>
        {cafes?.map((cafe) => {
            return(
                <StyledCarouselImage key={cafe.id}>
                    <CarouselMainImage cafe={cafe}/>
                </StyledCarouselImage>
        )})}
        </CarouselHorizontal>
    )
}

export default CafeByPlace;