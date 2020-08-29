import React from "react";
import "./index.css";
import { CafeInfo } from "../Cafe";
import CafeImageSlide from "../CafeImageSlide";
import CafeDetailsText from "../CafeDetailsText";

type CafeDetailProps = {
  cafe: CafeInfo | null;
};

const CafeDetails = ({ cafe }: CafeDetailProps) => {
  return (
    <div className="detail-mainbox">
      <div className="cafe-basicinfo">
        <CafeDetailsText cafe={cafe} />
      </div>

      <div className="cafe-image">
        <CafeImageSlide cafe={cafe} />
      </div>
    </div>
  );
};

export default CafeDetails;
