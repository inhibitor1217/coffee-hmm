import React from "react";
import { CafeInfo, CafesProps } from "../Cafes";
import CafeDetail from "../CafeDetail/CafeDetail";
import "./index.css";

type Cafeprops = {
  cafe: CafeInfo;
  widths: number[];
  colors: string[];
  idx: number;
  props: CafesProps;
  hidden: "visible" | "hidden";
  toggleVisible(): void;
};

const Cafe = ({
  cafe,
  widths,
  colors,
  idx,
  props,
  hidden,
  toggleVisible,
}: Cafeprops) => {
  return (
    <div id="space">
      <div
        id="border"
        style={{
          width: widths[idx],
          borderColor:
            props.filter !== null
              ? props.filter(cafe)
                ? colors[idx]
                : "#EDE7F6"
              : colors[idx],
        }}
        onClick={toggleVisible}
      >
        {cafe.title}
      </div>
      <div id="detail">
        <CafeDetail hidden={hidden} />
      </div>
    </div>
  );
};

export default Cafe;
