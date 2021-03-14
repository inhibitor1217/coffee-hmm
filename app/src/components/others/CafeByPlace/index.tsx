import React from 'react';
import { StyledCarouselImage } from '../../../utils/styled';
import CarouselMainImage from '../../others/CarouselMainImage';
import CarouselHorizontal from '../../others/CarouselHorizontal';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import introNavSlice from '../../../store/modules/intro-nav';
import { currentIntroCafeListSelector } from '../../../store/selectors/cafe';

const CafeByPlace = () => {
    const dispatch = useAppDispatch();
    const setCurrentCafeIndex = (index: number) => dispatch(introNavSlice.actions.navigateToCafe(index));

    const currentCafeIndex = useAppSelector(state => state.introNav.currentCafeIndex);
    const cafeList = useAppSelector(currentIntroCafeListSelector);

    if(cafeList?.length === 1){
        return  <CarouselMainImage cafe={cafeList[0]} index={0}/>
    }

    return(
        <CarouselHorizontal
            title="Carousel"
            initialIndex={currentCafeIndex}
            setCurrentIndex={setCurrentCafeIndex}
        >
        {cafeList?.map((cafe, index) => {
            return(
                <StyledCarouselImage key={cafe.id}>
                    <CarouselMainImage cafe={cafe} index={index}/>
                </StyledCarouselImage>
        )})}
        </CarouselHorizontal>
    )
}

export default CafeByPlace;