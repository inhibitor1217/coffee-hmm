import React from "react";
import Cafes from "../Cafes";
import { CafeInfo } from "../Cafe";

type MapProps = {
  filter: ((cafe: CafeInfo) => boolean) | null;
  cafeList: CafeInfo[] | null;
};

const Map = ({ filter, cafeList }: MapProps) => {
  cafeList?.sort(function (a, b) {
    return a.lat < b.lat ? -1 : a.lat > b.lat ? 1 : 0;
  });

  return (
    <div>
      <Cafes cafes={cafeList} filter={filter} />
    </div>
  );
};

export default Map;
