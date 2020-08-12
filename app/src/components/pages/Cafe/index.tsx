import React from "react";
import { CafeInfo, CafesProps } from "../Cafes";
import CafeDetail from "../CafeDetail/CafeDetail";

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
    <div>
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
        <div id="title" onClick={toggleVisible}>
          {cafe.title}
        </div>
      </div>
      <CafeDetail hidden={hidden} />
    </div>
  );
};

export default Cafe;
