import React from "react";
import "./index.css";

type CafeDetailProps = {
  hidden: "visible" | "hidden";
};

const CafeDetail = ({ hidden }: CafeDetailProps) => {
  return (
    <div
      style={{
        visibility: hidden,
      }}
    >
      <div className="small"></div>
      <div className="info"></div>
    </div>
  );
};

export default CafeDetail;
