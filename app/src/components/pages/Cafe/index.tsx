import React from "react";
import { CafeInfo, CafesProps } from "../Cafes";
import CafeDetail from "../CafeDetail";
import "./index.css";

type Cafeprops = {
  cafe: CafeInfo;
  boxes: string[];
  idx: number;
  props: CafesProps;
  hidden: "visible" | "hidden";
  toggleVisible(): void;
};

const Cafe = ({
  cafe,
  boxes,
  idx,
  props,
  hidden,
  toggleVisible,
}: Cafeprops) => {
  const imageUri = boxes[idx] ? `url(/images/${boxes[idx]}.png)` : undefined;
  console.log(imageUri);
  return (
    <div className="space">
      <div
        className="border"
        style={{
          backgroundImage: imageUri,
          backgroundRepeat: "no-repeat",
          // borderColor:
          //   props.filter !== null
          //     ? props.filter(cafe)
          //       ? colors[idx]
          //       : "#EDE7F6"
          //     : colors[idx],
        }}
        onClick={toggleVisible}
      >
        <div className="title">{cafe.title}</div>
      </div>
      <div className="detail">
        <CafeDetail hidden={hidden} />
      </div>
    </div>
  );
};

export default Cafe;
