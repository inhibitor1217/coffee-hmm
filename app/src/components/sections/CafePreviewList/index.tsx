import React from "react";
import styled from "styled-components";
import CafePreviewImg from "../CafePreviewImg";
import { CafeInfo } from "../MainFeed";

const PreviewWrapper = styled.div`
  width: 360px;
  margin: 0 auto;
  padding-bottom: 20px;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  align-content: space-around;
  background-color: rgba(var(--b3f, 250, 250, 250), 1);
`;

const PreviewBox = styled.span`
  min-width: 66px;
  min-height: 80px;
  margin-bottom: 12px;
`;

type CafePreviewListProps = {
  cafes: CafeInfo[] | null;
};

const CafePreviewList = ({ cafes }: CafePreviewListProps) => {
  return (
    <PreviewWrapper>
      {cafes?.map((cafe) => {
        return (
          <PreviewBox key={cafe.id}>
            <CafePreviewImg cafeName={cafe.name} cafeImg={cafe.mainImageUri} />
          </PreviewBox>
        );
      })}
    </PreviewWrapper>
  );
};

export default CafePreviewList;
