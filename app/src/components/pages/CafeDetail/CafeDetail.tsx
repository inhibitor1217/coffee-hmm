import React from "react";

type CafeDetailProps = {
  hidden: "visible" | "hidden";
};

const CafeDetail = ({ hidden }: CafeDetailProps) => {
  return (
    <div
      id="tooltip"
      style={{
        visibility: hidden,
      }}
    >
      tooltip msg
    </div>
  );
};

export default CafeDetail;
