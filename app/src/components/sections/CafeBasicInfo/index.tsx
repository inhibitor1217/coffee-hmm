import React from "react";
import { CafeInfo } from "../MainFeed";
import "./index.css";
import styled from "styled-components";
import { BasicInfoBox } from "../CafeDetailsText";

const BasicInfoWrapper = styled.div`
  display: flex;
  align-items: stretch;
  flex-direction: column;
`;

type CafeBasicInfoProps = {
  cafe: CafeInfo | null;
};

const CafeBasicInfo = ({ cafe }: CafeBasicInfoProps) => {
  return (
    <BasicInfoWrapper>
      <BasicInfoBox>
        <span className="binfo-name">{cafe?.name}</span>
        <span className="binfo-value">
          오늘도 정상영업 합니다:) <br />
          오늘도 정상영업 합니다:) <br />
          오늘도 정상영업 합니다:) <br />
          오늘도 정상영업 합니다:)
        </span>
      </BasicInfoBox>
    </BasicInfoWrapper>
  );
};

export default CafeBasicInfo;
