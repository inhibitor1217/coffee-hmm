import React from "react";
import "./index.css";
import styled from "styled-components";
import { Link, useLocation } from "react-router-dom";
import { InfoRow, CafeInfo } from "../../../utils";
import ImageSlideSmall from "../ImageSlideSmall";
import { VariableSizeList } from "react-window";

const BasicInfoWrapper = styled.div`
  display: flex;
  align-items: stretch;
  flex-direction: column;
`;

type CafeBasicInfoProps = {
  cafe: CafeInfo | null;
};

const SMALL_IMAGE_LIST_VISIBLE_WIDTH = 320;
const SMALL_IMAGE_LIST_SEMANTIC_WIDTH = 92;
const SMALL_IMAGE_LIST_VISIBLE_HEIGHT = 81;

const CafeBasicInfo = ({ cafe }: CafeBasicInfoProps) => {
  const location = useLocation();
  const cafeImageUris = cafe?.imageUris;

  return (
    <BasicInfoWrapper>
      <InfoRow className="binfo-cafe-name-a">
        <Link to={`/cafe/${cafe?.id}`}>
          <div className="binfo-cafe-name">{cafe?.name}</div>
        </Link>
        <div className="binfo-cafe-intro">
          오늘도 정상영업 합니다:) 오늘도 정상영업 합니다... 오늘도 정상영업
          합니다:) 오늘도 정상영업 합니다...
        </div>
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
          {cafeImageUris && (
            <VariableSizeList
              itemCount={cafeImageUris.length}
              width={SMALL_IMAGE_LIST_VISIBLE_WIDTH}
              height={SMALL_IMAGE_LIST_VISIBLE_HEIGHT}
              itemSize={() => SMALL_IMAGE_LIST_SEMANTIC_WIDTH}
              layout="horizontal"
              style={{ overflowY: "hidden" }}
            >
              {({ index, style }) => (
                <InfoRow className="small-image-slides" style={style}>
                  <ImageSlideSmall
                    imageUri={"https://" + cafeImageUris[index]}
                    key={cafeImageUris[index]}
                  />
                </InfoRow>
              )}
            </VariableSizeList>
          )}
        </div>
      )}
    </BasicInfoWrapper>
  );
};

export default CafeBasicInfo;
