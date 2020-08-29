import React from "react";
import { CafeInfo } from "../Cafe";
import "./index.css";

type CafeDetailsProps = {
  cafe: CafeInfo | null;
};

const CafeDetailsText = ({ cafe }: CafeDetailsProps) => {
  return (
    <div>
      <div className="top-text">
        <div className="goto">
          PANGYO YEOK RO
          <br />
          &nbsp; TAZA DE CAFÉ !
        </div>
        <div className="goto-name"># {cafe?.name}</div>
      </div>
      <div className="bottom-text">test</div>
    </div>
  );
};

export default CafeDetailsText;
