import React from "react";
import { CafeInfo } from "../MainFeed";
import "./index.css";
import styled from "styled-components";

const BasicInfoWrapper = styled.div`
  position: relative;
`;

type CafeBasicInfoProps = {
  cafe: CafeInfo | null;
};

const CafeBasicInfo = ({ cafe }: CafeBasicInfoProps) => {
  return (
    <BasicInfoWrapper>
      <span className="binfo-cafe-name">{cafe?.name}</span>
      <div className="binfo-cafe-intro">
        오늘도 정상영업 합니다:) <br />
        OPEN 8:00AM ~ CLOSE 19:00PM
      </div>
    </BasicInfoWrapper>
  );
};

export default CafeBasicInfo;
