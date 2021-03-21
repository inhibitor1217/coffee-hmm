import React from 'react';
import { Axis, SwipeablePanel } from '@inhibitor1217/react-swipeablepanel';
import CarouselMainImage from '../../others/CarouselMainImage';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { fetchCafesByPlace } from '../../../store/modules/cafe';
import introNavSlice from '../../../store/modules/intro-nav';
import {
    currentIntroCafeListSelector,
    currentIntroCafeSelector,
    currentIntroPlaceSelector,
} from '../../../store/selectors/cafe';
import { openSearch } from '../../../utils/function';
import { StyledCarouselImage, StyledRowFlex } from '../../../utils/styled';
import './index.css';

const CafeByPlace = () => {
    const dispatch = useAppDispatch();
    const currentPlace = useAppSelector(currentIntroPlaceSelector);
    const currentCafe = useAppSelector(currentIntroCafeSelector);
    const currentCafeIndex = useAppSelector(state => state.introNav.currentCafeIndex);
    
    const setCurrentCafeIndex = React.useCallback(
        (index: number) => dispatch(introNavSlice.actions.navigateToCafe(index)),
        [dispatch]
    );

    const cafeList = useAppSelector(currentIntroCafeListSelector);

    const cafeListPanel = React.useMemo(() => {
        if (!cafeList) {
            return null;
        }
        
        if (cafeList.length > 1) {
            return (
                <SwipeablePanel
                    key={currentPlace?.id ?? ''}
                    axis={Axis.horizontal}
                    initialPage={currentCafeIndex}
                    onPageChanged={setCurrentCafeIndex}
                    loop
                >
                    {cafeList?.map((cafe, index) => (
                        <StyledCarouselImage key={cafe.id}>
                            <CarouselMainImage cafe={cafe} index={index} />
                        </StyledCarouselImage>
                    ))}
                </SwipeablePanel>
            );
        }
        
        return (
            <CarouselMainImage cafe={cafeList[0]} index={0} />
        );
    // NOTE: (@inhibitor1217) [currentCafeIndex] 를 deps에 포함하지 않습니다.
    //       "place"가 업데이트 될 때에만 cafeListPanel 을 다시 그립니다.
    //       currentCafeIndex 수정 시 cafeListPanel 이 업데이트되면,
    //       애니메이션이 정상적으로 실행되지 않습니다.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentPlace, cafeList, setCurrentCafeIndex]);

    React.useEffect(() => {
        if (currentPlace) {
            dispatch(fetchCafesByPlace(currentPlace));
        }
    }, [dispatch, currentPlace]);

    return (
        <div className="carousel-container">
            <div className="cafe-preview-info">
                <h4>{currentCafe?.name}</h4>
                <span className="cafe-preview-info-list">
                    OPEN {currentCafe?.metadata?.hour}
                </span>
                <span className="cafe-preview-info-by">
                    {currentCafe?.metadata?.creator || 'jyuunnii'} 님이 올려주신 {currentCafe?.name}
                </span>
            </div>
            <div className="cafe-preview-carousel-wrapper">
                { cafeListPanel }
            </div>
            <StyledRowFlex className="cafe-preview-websearch">
                <span onClick={() => openSearch(`${currentCafe?.name ?? ''} ${currentCafe?.place.name ?? ''}`, "Naver")}>
                    <b className="web-naver">N</b> 네이버 바로가기
                </span>
                <span onClick={() => openSearch(`${currentCafe?.name ?? ''}`, "Instagram")}>
                    <b className="web-instagram">I</b> 인스타그램 바로가기
                </span>       
            </StyledRowFlex>
        </div>
    );
}

export default CafeByPlace;