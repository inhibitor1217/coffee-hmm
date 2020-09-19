import React from "react";
import "./index.css";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { InfoRow, CafeInfo } from "../../../utils";

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
      <InfoRow className="binfo-name-a">
        <Link to={`/cafe/${cafe?.id}`}>
          <span className="binfo-name">{cafe?.name}</span>
        </Link>
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
