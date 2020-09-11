import React from "react";
import { CafeInfo } from "../MainFeed";
import "./index.css";
import styled from "styled-components";
import { InfoRow } from "../CafeDetails";

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
      <InfoRow>
        <span className="binfo-name">{cafe?.name}</span>
        <span className="binfo-value">
          오늘도 정상영업 합니다:) <br />
          오늘도 정상영업 합니다:) <br />
          오늘도 정상영업 합니다:) <br />
          오늘도 정상영업 합니다:)
        </span>
      </InfoRow>
    </BasicInfoWrapper>
  );
};

export default CafeBasicInfo;
