import React from "react";
import styled from "styled-components";
import "./index.css";

const PlaceHeaderWrapper = styled.div`
  min-height: 80px;
  margin: 30px 16px;
  position: relative;
`;

type PlaceHeaderProps = {
  placeName: string;
};

const PlaceHeader = ({ placeName }: PlaceHeaderProps) => {
  return (
    <PlaceHeaderWrapper>
      <div className="spot-header-name">
        <span className="material-icons-outlined place-icon">place</span>
        {placeName}
      </div>
      <div className="spot-header-button">
        <button>거리보기</button>
      </div>
    </PlaceHeaderWrapper>
  );
};

export default PlaceHeader;
