import React from "react";
import styled from "styled-components";
import "./index.css";

const SpotHeaderWrapper = styled.div`
  min-height: 80px;
  margin: 30px 16px;
  position: relative;
`;

type SpotHeaderProps = {
  spotName: string;
};

const PlaceHeader = ({ spotName }: SpotHeaderProps) => {
  return (
    <SpotHeaderWrapper>
      <div className="spot-header-name">
        <span className="material-icons-outlined place-icon">place</span>
        {spotName}
      </div>
      <div className="spot-header-button">
        <button>거리보기</button>
      </div>
    </SpotHeaderWrapper>
  );
};

export default PlaceHeader;
