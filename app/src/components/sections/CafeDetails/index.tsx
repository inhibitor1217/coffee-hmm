import React from "react";
import "./index.css";
import CafeMenu from "../CafeMenu";
import { CafeInfo } from "../Cafe";

type CafeDetailProps = {
  cafe: CafeInfo | null;
};

const CafeDetails = ({ cafe }: CafeDetailProps) => {
  return (
    <div>
      <div className="cafe-image-box">
        <div className="cafe-image"></div>
      </div>
      <div className="cafe-detail">
        <ul className="cafe-detail-list">
          <li className="cafe-name">
            <span>name : </span>
            {cafe?.name}
          </li>
          <li className="cafe-am">
            <span>Americano : </span>
            {cafe?.americanoPrice}원
          </li>
          <li className="cafe-sp">
            <span>Special : </span>
            {cafe?.specialMenu}
          </li>
        </ul>
        <CafeMenu />
      </div>
    </div>
  );
};

export default CafeDetails;
