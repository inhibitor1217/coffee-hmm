import React from "react";
<<<<<<< HEAD
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
=======
import Cafes, { CafeInfo } from "../Cafes";
import "./index.css";

let cafeList = [
  {
    title: "워터 화이트",
    lat: 37.401251,
    lng: 127.110753,
    isVisited: true,
    americanoPrice: 2000,
    floor: 1,
    specialMenu: "플랫 화이트",
    specialMenuPrice: 3500,
    logo: false,
  },
  {
    title: "카페 무아르",
    lat: 37.401399,
    lng: 127.110903,
    isVisited: false,
    americanoPrice: 5000,
    floor: 1,
    specialMenu: "콜드 브루",
    specialMenuPrice: 4000,
    logo: false,
  },
  {
    title: "파브리끄",
    lat: 37.401251,
    lng: 127.110753,
    isVisited: false,
    americanoPrice: 2000,
    floor: 1,
    specialMenu: "녹차 라떼",
    specialMenuPrice: 4300,
    logo: false,
  },
  {
    title: "칼디 커피",
    lat: 37.401251,
    lng: 127.110753,
    isVisited: false,
    americanoPrice: 2000,
    floor: 1,
    specialMenu: "플랫 화이트",
    specialMenuPrice: 3500,
    logo: false,
  },
  {
    title: "스타벅스",
    lat: 37.401251,
    lng: 127.110753,
    isVisited: true,
    americanoPrice: 2000,
    floor: 1,
    specialMenu: "플랫 화이트",
    specialMenuPrice: 3500,
    logo: true,
  },
  {
    title: "빈바이빈",
    lat: 37.401251,
    lng: 127.110753,
    isVisited: true,
    americanoPrice: 2000,
    floor: 1,
    specialMenu: "플랫 화이트",
    specialMenuPrice: 3500,
    logo: false,
  },
  {
    title: "알레그리아",
    lat: 37.401251,
    lng: 127.110753,
    isVisited: true,
    americanoPrice: 2000,
    floor: 1,
    specialMenu: "플랫 화이트",
    specialMenuPrice: 3500,
    logo: false,
  },
  {
    title: "Water-White6",
    lat: 37.401251,
    lng: 127.110753,
    isVisited: true,
    americanoPrice: 2000,
    floor: 1,
    specialMenu: "플랫 화이트",
    specialMenuPrice: 3500,
    logo: false,
  },
  {
    title: "Water-White7",
    lat: 37.401251,
    lng: 127.110753,
    isVisited: true,
    americanoPrice: 2000,
    floor: 1,
    specialMenu: "플랫 화이트",
    specialMenuPrice: 3500,
    logo: false,
  },
  {
    title: "Water-White8",
    lat: 37.401251,
    lng: 127.110753,
    isVisited: true,
    americanoPrice: 2000,
    floor: 1,
    specialMenu: "플랫 화이트",
    specialMenuPrice: 3500,
    logo: false,
  },
  {
    title: "Water-White9",
    lat: 37.401251,
    lng: 127.110753,
    isVisited: true,
    americanoPrice: 2000,
    floor: 1,
    specialMenu: "플랫 화이트",
    specialMenuPrice: 3500,
    logo: false,
  },
  {
    title: "Water-White10",
    lat: 37.401251,
    lng: 127.110753,
    isVisited: true,
    americanoPrice: 2000,
    floor: 1,
    specialMenu: "플랫 화이트",
    specialMenuPrice: 3500,
    logo: false,
  },
  {
    title: "Water-White11",
    lat: 37.401251,
    lng: 127.110753,
    isVisited: true,
    americanoPrice: 2000,
    floor: 1,
    specialMenu: "플랫 화이트",
    specialMenuPrice: 3500,
    logo: false,
  },
];

type MapProps = {
  filter: ((cafe: CafeInfo) => boolean) | null;
};

const Map = ({ filter }: MapProps) => {
  cafeList.sort(function (a, b) {
    return a.lat < b.lat ? -1 : a.lat > b.lat ? 1 : 0;
  });
>>>>>>> ad6b733199c338f2f49cc4d1dcf1102b1f795704

  return (
    <div>
      <Cafes cafes={cafeList} filter={filter} />
    </div>
  );
};

export default Map;
