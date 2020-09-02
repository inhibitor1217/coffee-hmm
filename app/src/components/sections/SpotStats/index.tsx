import React from "react";
import styled from "styled-components";
import "./index.css";

const SpotStatsWrapper = styled.div`
  height: 36px;
  padding: 12px 0px;
  border-top: 1px solid #dbdbdb;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  align-content: space-around;
`;

const SpotStats = () => {
  return (
    <SpotStatsWrapper>
      <div className="spot-stat">
        Cafe <br /> 50
      </div>
      <div className="spot-stat">
        Photo <br /> 100
      </div>
      <div className="spot-stat">
        Americano <br /> 4.0
      </div>
    </SpotStatsWrapper>
  );
};

export default SpotStats;
