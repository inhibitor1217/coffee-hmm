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
      <div id="small"></div>
      <div id="info"></div>
    </div>
  );
};

export default CafeDetail;
