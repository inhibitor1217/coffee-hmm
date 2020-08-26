import React from "react";
import "./index.css";
import { Link } from "react-router-dom";
import { CafeInfo } from "../Cafe";

type CafeDetailProps = {
  cafe: CafeInfo;
  hidden: boolean;
  lineImg: string | undefined;
};

const cafePreview = (
  cafe: CafeInfo,
  hidden: boolean,
  lineImg: string | undefined
) => {
  if (!hidden) {
    const starIconUri = cafe ? `url(/images/star.png)` : undefined;
    const cafeIconUri = cafe
      ? `url(/images/cafe_logo/${cafe.name}.png)`
      : undefined;

    return (
      <div
        className="info"
        style={{
          backgroundImage: lineImg,
          visibility: "visible",
        }}
      >
        <Link to="/cafe/1">
          <div className="content">
            <span
              className="cafe-logo"
              style={{
                backgroundImage: cafe.logo === true ? cafeIconUri : "none",
              }}
            ></span>
            <h3>
              {cafe.name} {cafe.floor}F
            </h3>
            아메리카노 {cafe.americanoPrice}원<br />
            <span
              className="star-icon"
              style={{
                backgroundImage: starIconUri,
              }}
            ></span>
            {cafe.specialMenu} {cafe.specialMenuPrice}원 <br />
          </div>
          <div className="more">더보기</div>
        </Link>
      </div>
    );
  }
};

const CafeDetail = ({ cafe, hidden, lineImg }: CafeDetailProps) => {
  const preview = cafePreview(cafe, hidden, lineImg);
  return <div>{preview}</div>;
};

export default CafeDetail;
