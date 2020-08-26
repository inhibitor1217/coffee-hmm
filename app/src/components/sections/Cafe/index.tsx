import React from "react";
import { CafesProps } from "../Cafes";
import "./index.css";
import CafePreview from "../CafePreview";

export type CafeInfo = {
  id: string;
  name: string;
  imageUris: string[];
  mainImageUri: string;
  lat: number;
  lng: number;
  americanoPrice: number;
  floor: number;
  specialMenu: string;
  specialMenuPrice: number;
  logo: boolean;
};

type CafePreviewProps = {
  cafe: CafeInfo;
  boxes: string[];
  lineImages: string[];
  idx: number;
  props: CafesProps;
  hidden: boolean;
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
}: CafePreviewProps) => {
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
        <span className="cafe-title">{cafe.name}</span>
      </div>
      <div className="cafe-detail">
        <CafePreview cafe={cafe} hidden={hidden} lineImg={lineImageUri} />
      </div>
    </div>
  );
};

export default Cafe;
