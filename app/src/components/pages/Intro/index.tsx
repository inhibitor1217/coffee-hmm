import React, { useEffect } from 'react';
import { StyledColumnFlex, StyledMainScale } from '../../../utils/styled';
import PlaceSlide from '../../others/PlaceSlide';
import CafeByPlace from '../../others/CafeByPlace';
import InitialLoading from '../../others/InitialLoading';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { fetchPlaces } from '../../../store/modules/cafe';

const Intro: React.FC = () => {
  const dispatch = useAppDispatch();
  const places = useAppSelector((state) => state.cafe.place?.list);
  const isInitialCafeImageReady = useAppSelector(
    (state) => state.introNav.isInitialCafeImageReady,
  );
  const hasInitialClick = useAppSelector(
    (state) => state.introNav.hasInitialClick,
  );
  const isInitialLoading = !hasInitialClick && !isInitialCafeImageReady;

  useEffect(() => {
    dispatch(fetchPlaces());
  }, [dispatch]);

  return (
    <StyledMainScale>
      {isInitialLoading && <InitialLoading />}
      <StyledColumnFlex
        className="intro"
        style={{ visibility: isInitialLoading ? 'hidden' : 'visible' }}
      >
        <CafeByPlace />
        {places && <PlaceSlide places={places} />}
      </StyledColumnFlex>
    </StyledMainScale>
  );
};

export default Intro;
