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
  hiddenList: ("visible" | "hidden")[];
  setHidden(hidden: ("visible" | "hidden")[]): void;
};

const Cafe = ({
  cafe,
  widths,
  colors,
  idx,
  props,
  hidden,
  hiddenList,
  setHidden,
}: Cafeprops) => {
  const getInfo = () => {
    const newHiddenList = [...hiddenList];
    if (hidden === "hidden") {
      newHiddenList[idx] = "visible";
      setHidden(newHiddenList);
    } else {
      newHiddenList[idx] = "hidden";
      setHidden(hiddenList);
    }
  };

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
        <div id="title" onClick={getInfo}>
          {cafe.title}
        </div>
      </div>
      <CafeDetail hidden={hidden} />
    </div>
  );
};

export default Cafe;
