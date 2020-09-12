import React from "react";
import styled from "styled-components";
import "./index.css";
import { CafeInfo } from "../MainFeed";

const PlaceStatsWrapper = styled.div`
  height: 36px;
  padding: 12px 0px;
  border-top: 1px solid #dbdbdb;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  align-content: space-around;
`;

type PlaceStatsProps = {
  cafes: CafeInfo[] | null;
};

const calAvgAmericanoPrice = (cafes: CafeInfo[] | null) => {
  let sum = 0;
  cafes?.map((cafe) => {
    sum += Number(cafe.americanoPrice);
  });

  return ((sum / (cafes?.length || 1)) * 0.001).toFixed(1);
};

const PlaceStats = ({ cafes }: PlaceStatsProps) => {
  return (
    <PlaceStatsWrapper>
      <div className="spot-stat">
        Cafe <br /> {cafes?.length}
      </div>
      <div className="spot-stat">
        New <br /> 2
      </div>
      <div className="spot-stat">
        Americano <br /> {calAvgAmericanoPrice(cafes)}
      </div>
    </PlaceStatsWrapper>
  );
};

export default PlaceStats;
