import React from "react";
import styled from "styled-components";
import "./index.css";
import { CafeInfo } from "../MainFeed";

const SpotStatsWrapper = styled.div`
  height: 36px;
  padding: 12px 0px;
  border-top: 1px solid #dbdbdb;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  align-content: space-around;
`;

type SpotStatsProps = {
  cafes: CafeInfo[] | null;
};

const calAvgAmericanoPrice = (cafes: CafeInfo[] | null) => {
  let sum = 0;
  cafes?.map((cafe) => {
    sum += cafe.americanoPrice;
  });

  return ((sum / (cafes?.length || 1)) * 0.001).toFixed(1);
};

const SpotStats = ({ cafes }: SpotStatsProps) => {
  return (
    <SpotStatsWrapper>
      <div className="spot-stat">
        Cafe <br /> {cafes?.length}
      </div>
      <div className="spot-stat">
        Photo <br /> 100
      </div>
      <div className="spot-stat">
        Americano <br /> {calAvgAmericanoPrice(cafes)}
      </div>
    </SpotStatsWrapper>
  );
};

export default SpotStats;
