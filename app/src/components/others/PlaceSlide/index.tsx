import React from "react";
import classNames from "classnames";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import introNavSlice from "../../../store/modules/intro-nav";
import { TypePlace } from "@types";

import "./index.css";

type PlaceSlideProps = {
  places: TypePlace[];
};

const PlaceSlide = ({ places }: PlaceSlideProps) => {
  const dispatch = useAppDispatch();
  const handleClick = (index: number) =>
    dispatch(introNavSlice.actions.navigateToPlace(index));

  const currentPlaceIndex = useAppSelector(
    (state) => state.introNav.currentPlaceIndex
  );

  return (
    <div className={classNames("wrapper")}>
      {places.map((place, index) => {
        const isActive = currentPlaceIndex === index;
        return (
          <div
            className={classNames("place")}
            key={place.id}
            onClick={() => handleClick(index)}
          >
            <span className={classNames("text", isActive && "active")}>
              {place.name}
            </span>
            <span className={classNames("dot", isActive && "active")}></span>
          </div>
        );
      })}
    </div>
  );
};

export default PlaceSlide;
