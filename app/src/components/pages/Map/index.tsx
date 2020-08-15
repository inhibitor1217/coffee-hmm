import React from "react";
import Cafes, { CafeInfo } from "../Cafes";
import "./index.css";

let cafeList = [
  {
    title: "워터 화이트",
    lat: 37.401251,
    lng: 127.110753,
    isVisited: true,
    avgPrice: 2000,
  },
  {
    title: "Cafe-Moire",
    lat: 37.401399,
    lng: 127.110903,
    isVisited: false,
    avgPrice: 5000,
  },
  {
    title: "Water-White1",
    lat: 37.401251,
    lng: 127.110753,
    isVisited: false,
    avgPrice: 2000,
  },
  {
    title: "Water-White2",
    lat: 37.401251,
    lng: 127.110753,
    isVisited: false,
    avgPrice: 2000,
  },
  {
    title: "Water-White3",
    lat: 37.401251,
    lng: 127.110753,
    isVisited: true,
    avgPrice: 2000,
  },
  {
    title: "Water-White4",
    lat: 37.401251,
    lng: 127.110753,
    isVisited: true,
    avgPrice: 2000,
  },
  {
    title: "Water-White5",
    lat: 37.401251,
    lng: 127.110753,
    isVisited: true,
    avgPrice: 2000,
  },
  {
    title: "Water-White6",
    lat: 37.401251,
    lng: 127.110753,
    isVisited: true,
    avgPrice: 2000,
  },
  {
    title: "Water-White7",
    lat: 37.401251,
    lng: 127.110753,
    isVisited: true,
    avgPrice: 2000,
  },
  {
    title: "Water-White8",
    lat: 37.401251,
    lng: 127.110753,
    isVisited: true,
    avgPrice: 2000,
  },
];

type MapProps = {
  filter: ((cafe: CafeInfo) => boolean) | null;
};

const Map = ({ filter }: MapProps) => {
  cafeList.sort(function (a, b) {
    return a.lat < b.lat ? -1 : a.lat > b.lat ? 1 : 0;
  });

  return (
    <div className="box">
      <Cafes cafes={cafeList} filter={filter} />
    </div>
  );
};

export default Map;
