import React, { useState } from "react";
import { CafeInfo, CafesProps } from "../Cafes";

type Cafeprops = {
  cafe: CafeInfo;
  widths: number[];
  colors: string[];
  idx: number;
  props: CafesProps;
};

const Cafe = ({ cafe, widths, colors, idx, props }: Cafeprops) => {
  // const [isClicked, setIsClicked] = useState<boolean>(false);
  return (
    <div
      id="space"
      style={{
        width: widths[idx],
        backgroundColor:
          props.filter !== null
            ? props.filter(cafe)
              ? colors[idx]
              : "#EDE7F6"
            : colors[idx],
      }}
    >
      <div id="title">{cafe.title}</div>
      <div></div>
    </div>
  );
};

export default Cafe;
