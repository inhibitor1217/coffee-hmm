import React from "react";
import { CafeInfo, CafesProps } from "../Cafes";

type Cafeprops = {
  cafe: CafeInfo;
  widths: number[];
  idx: number;
  props: CafesProps;
};

const Cafe = ({ cafe, widths, idx, props }: Cafeprops) => {
  return (
    <div
      id="space"
      style={{
        width: widths[idx],
        backgroundColor:
          props.filter !== null
            ? props.filter(cafe)
              ? "beige"
              : "#EDE7F6"
            : "beige",
      }}
    >
      <div id="title">{cafe.title}</div>
    </div>
  );
};

export default Cafe;
