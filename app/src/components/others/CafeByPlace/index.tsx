import React from 'react';
import CafeMainImageCarousel from '../CafeMainImageCarousel';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { fetchCafesByPlace } from '../../../store/modules/cafe';
import {
    currentIntroCafeSelector,
    currentIntroPlaceSelector,
} from '../../../store/selectors/cafe';
import { openSearch } from '../../../utils/function';
import { StyledRowFlex } from '../../../utils/styled';
import './index.css';
import { CafeCreatorPlaceholder, CafeInfoPlaceholder, CafeNamePlaceholder, CafePreviewPanelPlaceholder, CafeWebSearchPlaceholder } from './styled';

const CafeByPlace = () => {
    const dispatch = useAppDispatch();
    const currentPlace = useAppSelector(currentIntroPlaceSelector);
    const currentCafe = useAppSelector(currentIntroCafeSelector);

    React.useEffect(() => {
        if (currentPlace) {
            dispatch(fetchCafesByPlace(currentPlace));
        }
    }, [dispatch, currentPlace]);

    if (!currentCafe) {
        return (
            <div className="carousel-container">
                <div className="cafe-preview-info">
                    <CafeNamePlaceholder />
                    <CafeInfoPlaceholder />
                    <CafeCreatorPlaceholder />
                </div>
                <div className="cafe-preview-carousel-wrapper">
                    <CafePreviewPanelPlaceholder />
                </div>
                <CafeWebSearchPlaceholder />
            </div>
        )
    }

    return (
        <div className="carousel-container">
            <div className="cafe-preview-info">
                <h4>{currentCafe.name}</h4>
                <span className="cafe-preview-info-list">
                    OPEN {currentCafe.metadata?.hour}
                </span>
                <span className="cafe-preview-info-by">
                    {currentCafe.metadata?.creator || 'jyuunnii'} 님이 올려주신 {currentCafe?.name}
                </span>
            </div>
            <div className="cafe-preview-carousel-wrapper">
                <CafeMainImageCarousel />
            </div>
            <StyledRowFlex className="cafe-preview-websearch">
                <span onClick={() => openSearch(`${currentCafe.name} ${currentCafe.place.name}`, "Naver")}>
                    <b className="web-naver">N</b> 네이버 바로가기
                </span>
                <span onClick={() => openSearch(currentCafe.name, "Instagram")}>
                    <b className="web-instagram">I</b> 인스타그램 바로가기
                </span>       
            </StyledRowFlex>
        </div>
    );
}

export default CafeByPlace;