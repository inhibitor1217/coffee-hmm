import React from "react";
import styled from "styled-components";
import "./index.css";

const SpotHeaderWrapper = styled.div`
  min-height: 90px;
  margin: 30px 16px;
  position: relative;
`;

type SpotHeaderProps = {
  spotName: string;
};

const SpotHeader = ({ spotName }: SpotHeaderProps) => {
  return (
    <SpotHeaderWrapper>
      <div>
        <span className="spot-header-icon">
          <img
            src="/images/coffee-hmm-192x192.png"
            alt={spotName}
            width="68px"
            height="68px"
          />
        </span>
      </div>
      <div className="spot-header-name">{spotName}&nbsp;카페 </div>
      <div className="spot-header-button">
        <button>map</button>
      </div>
    </SpotHeaderWrapper>
  );
};

export default SpotHeader;
