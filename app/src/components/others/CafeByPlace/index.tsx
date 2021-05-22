import React from 'react';
import { Link } from 'react-router-dom';
import CafeMainImageCarousel from '../CafeMainImageCarousel';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { fetchCafesByPlace } from '../../../store/modules/cafe';
import {
  currentIntroCafeSelector,
  currentIntroPlaceSelector,
} from '../../../store/selectors/cafe';
import { openSearch } from '../../../utils/function';
import { StyledColumnFlex, StyledRowFlex } from '../../../utils/styled';
import './index.css';
import {
  CafeCreatorPlaceholder,
  CafeInfoPlaceholder,
  CafeNamePlaceholder,
  CafePreviewPanelPlaceholder,
  CafeWebSearchPlaceholder,
} from './styled';

const CafeByPlace: React.FC = () => {
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
      <div>
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
    );
  }

  return (
    <div>
      <Link to={`/cafe/${currentCafe?.id}`} className="cafe-preview-wrapper">
        <StyledColumnFlex className="cafe-preview-info">
          <h4>{currentCafe.name}</h4>
          <p className="cafe-preview-info-meta">
            <span>{currentCafe.place.name}</span>
            <span>OPEN {currentCafe.metadata?.hour}</span>
          </p>
          <p className="cafe-preview-info-by">
            {currentCafe.metadata?.creator || 'jyuunnii'} 님이 올려주신{' '}
            {currentCafe.name}
          </p>
        </StyledColumnFlex>
        <div className="cafe-preview-carousel-wrapper">
          <CafeMainImageCarousel />
        </div>
      </Link>
      <StyledRowFlex className="cafe-preview-websearch">
        <span
          onClick={() =>
            openSearch(`${currentCafe.name} ${currentCafe.place.name}`, 'Naver')
          }
        >
          <b className="web-naver">N</b> 네이버 바로가기
        </span>
        <span onClick={() => openSearch(currentCafe.name, 'Instagram')}>
          <b className="web-instagram">I</b> 인스타그램 바로가기
        </span>
      </StyledRowFlex>
    </div>
  );
};

export default CafeByPlace;
