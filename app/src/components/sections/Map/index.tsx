import React from "react";
import Cafes from "../Cafes";
import "./index.css";
import { CafeInfo } from "../Cafe";

// let cafeList = [
//   {
//     name: "워터 화이트",
//     lat: 37.401251,
//     lng: 127.110753,
//     isVisited: true,
//     americanoPrice: 2000,
//     floor: 1,
//     specialMenu: "플랫 화이트",
//     specialMenuPrice: 3500,
//     logo: false,
//   },
//   {
//     name: "카페 무아르",
//     lat: 37.401399,
//     lng: 127.110903,
//     isVisited: false,
//     americanoPrice: 5000,
//     floor: 1,
//     specialMenu: "콜드 브루",
//     specialMenuPrice: 4000,
//     logo: false,
//   },
//   {
//     name: "파브리끄",
//     lat: 37.401251,
//     lng: 127.110753,
//     isVisited: false,
//     americanoPrice: 2000,
//     floor: 1,
//     specialMenu: "녹차 라떼",
//     specialMenuPrice: 4300,
//     logo: false,
//   },
//   {
//     name: "칼디 커피",
//     lat: 37.401251,
//     lng: 127.110753,
//     isVisited: false,
//     americanoPrice: 2000,
//     floor: 1,
//     specialMenu: "플랫 화이트",
//     specialMenuPrice: 3500,
//     logo: false,
//   },
//   {
//     name: "스타벅스",
//     lat: 37.401251,
//     lng: 127.110753,
//     isVisited: true,
//     americanoPrice: 2000,
//     floor: 1,
//     specialMenu: "플랫 화이트",
//     specialMenuPrice: 3500,
//     logo: true,
//   },
//   {
//     name: "빈바이빈",
//     lat: 37.401251,
//     lng: 127.110753,
//     isVisited: true,
//     americanoPrice: 2000,
//     floor: 1,
//     specialMenu: "플랫 화이트",
//     specialMenuPrice: 3500,
//     logo: false,
//   },
//   {
//     name: "알레그리아",
//     lat: 37.401251,
//     lng: 127.110753,
//     isVisited: true,
//     americanoPrice: 2000,
//     floor: 1,
//     specialMenu: "플랫 화이트",
//     specialMenuPrice: 3500,
//     logo: false,
//   },
//   {
//     name: "Water-White6",
//     lat: 37.401251,
//     lng: 127.110753,
//     isVisited: true,
//     americanoPrice: 2000,
//     floor: 1,
//     specialMenu: "플랫 화이트",
//     specialMenuPrice: 3500,
//     logo: false,
//   },
//   {
//     name: "Water-White7",
//     lat: 37.401251,
//     lng: 127.110753,
//     isVisited: true,
//     americanoPrice: 2000,
//     floor: 1,
//     specialMenu: "플랫 화이트",
//     specialMenuPrice: 3500,
//     logo: false,
//   },
//   {
//     name: "Water-White8",
//     lat: 37.401251,
//     lng: 127.110753,
//     isVisited: true,
//     americanoPrice: 2000,
//     floor: 1,
//     specialMenu: "플랫 화이트",
//     specialMenuPrice: 3500,
//     logo: false,
//   },
//   {
//     name: "Water-White9",
//     lat: 37.401251,
//     lng: 127.110753,
//     isVisited: true,
//     americanoPrice: 2000,
//     floor: 1,
//     specialMenu: "플랫 화이트",
//     specialMenuPrice: 3500,
//     logo: false,
//   },
//   {
//     name: "Water-White10",
//     lat: 37.401251,
//     lng: 127.110753,
//     isVisited: true,
//     americanoPrice: 2000,
//     floor: 1,
//     specialMenu: "플랫 화이트",
//     specialMenuPrice: 3500,
//     logo: false,
//   },
//   {
//     name: "Water-White11",
//     lat: 37.401251,
//     lng: 127.110753,
//     isVisited: true,
//     americanoPrice: 2000,
//     floor: 1,
//     specialMenu: "플랫 화이트",
//     specialMenuPrice: 3500,
//     logo: false,
//   },
// ];

type MapProps = {
  filter: ((cafe: CafeInfo) => boolean) | null;
  cafeList: CafeInfo[] | null;
};

const Map = ({ filter, cafeList }: MapProps) => {
  console.log(cafeList);
  // cafeList?.cafes.sort(function (a, b) {
  //   return a.lat < b.lat ? -1 : a.lat > b.lat ? 1 : 0;
  // });

  return (
    <div>
      <Cafes cafes={cafeList} filter={filter} />
    </div>
  );
};

export default Map;
