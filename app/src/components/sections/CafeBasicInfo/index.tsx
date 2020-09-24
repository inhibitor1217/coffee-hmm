import React from "react";
import "./index.css";
import styled from "styled-components";
import { Link, useLocation } from "react-router-dom";
import { InfoRow, CafeInfo } from "../../../utils";
import ImageSlideSmall from "../ImageSlideSmall";

const BasicInfoWrapper = styled.div`
  display: flex;
  align-items: stretch;
  flex-direction: column;
`;

type CafeBasicInfoProps = {
  cafe: CafeInfo | null;
};

let cafeImageUris: string[] | undefined = [];

const CafeBasicInfo = ({ cafe }: CafeBasicInfoProps) => {
  const location = useLocation();
  cafeImageUris = cafe?.imageUris;

  return (
    <BasicInfoWrapper>
      <InfoRow className="binfo-name-a">
        <Link to={`/cafe/${cafe?.id}`}>
          <div className="binfo-name">{cafe?.name}</div>
        </Link>
        <span className="binfo-value">
          오늘도 정상영업 합니다:) 오늘도 정상영업 합니다... 오늘도 정상영업
          합니다:) 오늘도 정상영업 합니다...
        </span>
      </InfoRow>
      {!location.pathname.includes("/cafe") && (
        <div>
          <InfoRow>
            <ul className="tag-list">
              <li>플랫화이트</li>
              <li>테라스</li>
              <li>케이크</li>
            </ul>
          </InfoRow>
          <InfoRow className="small-image-slides">
            {cafeImageUris?.map((uri) => {
              return <ImageSlideSmall imageUri={"https://" + uri} key={uri} />;
            })}
          </InfoRow>
        </div>
      )}
    </BasicInfoWrapper>
  );
};

export default CafeBasicInfo;
