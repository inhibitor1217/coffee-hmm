import React from 'react';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import introNavSlice from '../../../store/modules/intro-nav';
import { StyledRowFlex } from '../../../utils/styled';
import { TypePlace } from '../../../utils/type';
import './index.css';

type PlaceSlideProps = {
  places: TypePlace[];
};

const PlaceSlide = ({ places }: PlaceSlideProps) => {
  const dispatch = useAppDispatch();
  const handleClick = (index: number) =>
    dispatch(introNavSlice.actions.navigateToPlace(index));

  const currentPlaceIndex = useAppSelector(
    (state) => state.introNav.currentPlaceIndex,
  );

  return (
    <StyledRowFlex className="place-container">
      {places.map((place, index) => {
        return (
          <div
            key={place.id}
            className="place-wrapper"
            onClick={() => handleClick(index)}
          >
            <span
              className="place-box"
              style={{
                backgroundColor:
                  currentPlaceIndex === index
                    ? 'rgba(196, 196, 196, 0.3'
                    : 'transparent',
              }}
            >
              {place.name}
            </span>
            <span
              className="place-dot"
              style={{
                backgroundColor:
                  currentPlaceIndex === index ? '#ED6161' : 'transparent',
              }}
            ></span>
          </div>
        );
      })}
    </StyledRowFlex>
  );
};

export default PlaceSlide;
