import React from "react";
import classNames from "classnames";

import { Place } from "types/common";
import { useAppDispatch, useAppSelector } from "store/hooks";
import introNavSlice from "store/modules/intro-nav";

import "./index.css";

type PlaceSlideProps = {
  places: Place[];
};

const PlaceSlide = ({ places }: PlaceSlideProps) => {
  const dispatch = useAppDispatch();
  const handleClick = (index: number) =>
    dispatch(introNavSlice.actions.navigateToPlace(index));

  const currentPlaceIndex = useAppSelector(
    (state) => state.introNav.currentPlaceIndex,
  );

  return (
    <div className={classNames("wrapper")}>
      {places.map((place, index) => {
        const isActive = currentPlaceIndex === index;
        return (
          <div key={place.id} onClick={() => handleClick(index)}>
            <span className={classNames("text", { active: isActive })}>
              {place.name}
            </span>
            <span className={classNames("dot", { active: isActive })}></span>
          </div>
        );
      })}
    </div>
  );
};

export default PlaceSlide;
