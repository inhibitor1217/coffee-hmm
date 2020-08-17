import React from "react";
import { CafeInfo, CafesProps } from "../Cafes";
import CafeDetail from "../CafeDetail";
import "./index.css";

type Cafeprops = {
  cafe: CafeInfo;
  boxes: string[];
  lineImages: string[];
  idx: number;
  props: CafesProps;
  hidden: "visible" | "hidden";
  toggleVisible(): void;
};

const Cafe = ({
  cafe,
  boxes,
  lineImages,
  idx,
  props,
  hidden,
  toggleVisible,
}: Cafeprops) => {
  const imageUri = boxes[idx] ? `url(/images/${boxes[idx]}.png)` : undefined;
  const lineImageUri = boxes[idx]
    ? `url(/images/${lineImages[idx]}.png)`
    : undefined;
  return (
    <div className="cafe-space">
      <div
        className="cafe-border"
        style={{
          backgroundImage: imageUri,
          backgroundRepeat: "no-repeat",
        }}
        onClick={toggleVisible}
      >
        <span
          className="material-icons cafe-filter-icon"
          style={{
            visibility:
              props.filter !== null
                ? props.filter(cafe)
                  ? "hidden"
                  : "visible"
                : "hidden",
            color: "#CE93D8",
            fontSize: "10px",
          }}
        >
          fiber_manual_record
        </span>
        <span className="cafe-title">{cafe.title}</span>
      </div>
      <div className="cafe-detail">
        <CafeDetail cafe={cafe} hidden={hidden} lineImg={lineImageUri} />
      </div>
    </div>
  );
};

export default Cafe;
