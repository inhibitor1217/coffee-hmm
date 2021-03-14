import React, { useEffect, useState } from 'react';
import { openSearch } from '../../../utils/function';
import { StyledColumnFlex, StyledMainScale, StyledRowFlex } from '../../../utils/styled';
import PlaceSlide from '../../others/PlaceSlide';
import CafeByPlace from '../../others/CafeByPlace';
import InitialLoading from '../../others/InitialLoading';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { fetchCafesByPlace, fetchPlaces } from '../../../store/modules/cafe';
import { currentIntroCafeSelector, currentIntroPlaceSelector } from '../../../store/selectors/cafe';
import './index.css';

const Intro = () => {
    const [hasInitialClick, setInitialClick] = useState(false);
    const dispatch = useAppDispatch();
    const places = useAppSelector(state => state.cafe.place?.list);
    const currentPlace = useAppSelector(currentIntroPlaceSelector);
    const currentCafe = useAppSelector(currentIntroCafeSelector);
    const isInitialCafeImageReady = useAppSelector(state => state.introNav.isInitialCafeImageReady);

    useEffect(() => {
        dispatch(fetchPlaces());
    }, [dispatch]);

    useEffect(() => {
        if (currentPlace) {
            dispatch(fetchCafesByPlace(currentPlace));
        }
    }, [dispatch, currentPlace]);

    return(
        <StyledMainScale>
            {!hasInitialClick && !isInitialCafeImageReady && <InitialLoading/> }
            {currentCafe && 
                <StyledColumnFlex className="intro" style={{display: !hasInitialClick && !isInitialCafeImageReady? 'none' : 'block'}}>
                    <div className="carousel-container">
                        <div className="cafe-preview-info">
                            <h4>{currentCafe?.name}</h4>
                            <span className="cafe-preview-info-list">OPEN {currentCafe?.metadata?.hour}</span>
                            <span className="cafe-preview-info-by">{currentCafe?.metadata?.creator || 'jyuunnii'} 님이 올려주신 {currentCafe?.name}</span>
                        </div>
                        <CafeByPlace/>
                        <StyledRowFlex className="cafe-preview-websearch">
                            <span onClick={() => openSearch((currentCafe?.name)+" "+currentCafe.place.name, "Naver")}><b className="web-naver">N</b> 네이버 바로가기</span>
                            <span onClick={() => openSearch((currentCafe?.name), "Instagram")}><b className="web-instagram">I</b> 인스타그램 바로가기</span>       
                        </StyledRowFlex>
                    </div>
                    { places && <PlaceSlide places={places} setInitialClick={setInitialClick}/> }
                </StyledColumnFlex>
            }  
        </StyledMainScale>
    )
}

export default Intro;