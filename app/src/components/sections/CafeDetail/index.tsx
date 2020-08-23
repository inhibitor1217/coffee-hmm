import React from "react";
import "./index.css";
import { CafeInfo } from "../Cafes";
import { Link } from "react-router-dom";

type CafeDetailProps = {
  cafe: CafeInfo;
  hidden: "visible" | "hidden";
  lineImg: string | undefined;
};

const CafeDetail = ({ cafe, hidden, lineImg }: CafeDetailProps) => {
  return (
    <div
      style={{
        visibility: hidden,
      }}
    >
      {(function () {
        if (hidden === "visible") {
          const starIconUri = cafe ? `url(/images/star.png)` : undefined;
          const cafeIconUri = cafe
            ? `url(/images/cafe_logo/${cafe.title}.png)`
            : undefined;

          return (
            <div
              className="info"
              style={{
                backgroundImage: lineImg,
              }}
            >
              <Link to="/cafe">
                <div className="content">
                  <span
                    className="cafe-logo"
                    style={{
                      backgroundImage:
                        cafe.logo === true ? cafeIconUri : "none",
                    }}
                  ></span>
                  <h3>
                    {cafe.title} {cafe.floor}F
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
      })()}
    </div>
  );
};

export default CafeDetail;
