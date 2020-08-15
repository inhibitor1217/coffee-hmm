import React from "react";
import "./index.css";

type CafeDetailProps = {
  hidden: "visible" | "hidden";
  lineImg: string | undefined;
};

const CafeDetail = ({ hidden, lineImg }: CafeDetailProps) => {
  return (
    <div
      style={{
        visibility: hidden,
      }}
    >
      {(function () {
        if (hidden === "visible") {
          return (
            <div
              className="info"
              style={{
                backgroundImage: lineImg,
              }}
            >
              <div>cafe information</div>
            </div>
          );
        }
      })()}
    </div>
  );
};

export default CafeDetail;
