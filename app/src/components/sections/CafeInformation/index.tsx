import React from "react";
import "./index.css";
import { withRouter } from "react-router-dom";
import CafeMenu from "../CafeMenu";

const CafeInformation = () => {
  return (
    <div>
      <div className="cafe-image-box">
        <div className="cafe-image"></div>
      </div>
      <CafeMenu />
    </div>
  );
};

export default withRouter(CafeInformation);
