import React from "react";
import { HomeScale } from "../Main";
import PlaceGuide from "../../sections/PlaceGuide";

const PlaceListPage = () => {
  return (
    <HomeScale>
      <PlaceGuide placeCategories={popularPlaces} />
    </HomeScale>
  );
};

export let popularPlaces = [
  "한남",
  "연남",
  "성수",
  "건대입구",
  "강남",
  "잠실",
  "남양주",
  "샤로수길",
  "판교",
  "한남",
  "연남",
  "성수",
  "건대입구",
  "강남",
  "잠실",
  "남양주",
  "샤로수길",
  "판교",
  "한남",
  "연남",
  "성수",
  "건대입구",
  "강남",
  "잠실",
  "남양주",
  "샤로수길",
  "판교",
  "한남",
  "연남",
  "성수",
];

export default PlaceListPage;
