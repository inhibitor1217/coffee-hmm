import React from "react";
import { CafeInfo } from "../MainFeed";
import styled from "styled-components";
import PostHeader from "../PostHeader";
import CafeImageSlide from "../CafeImageSlide";
import PostIcon from "../PostIcon";
import CafeDetailsText from "../CafeDetailsText";
import { ImageWrapper, IconWrapper, TextWrapper } from "../PostContents";

const DetailContainer = styled.div`
  display: flex;
  align-items: stretch;
  justify-content: center;
  flex-direction: column;
`;

type CafeDetailInfoProps = {
  cafe: CafeInfo | null;
};

const CafeDetailInfo = ({ cafe }: CafeDetailInfoProps) => {
  return (
    <DetailContainer>
      <PostHeader cafeId={cafe?.id} cafeName={cafe?.name} />
      <ImageWrapper>
        <CafeImageSlide cafe={cafe} />
      </ImageWrapper>
      <IconWrapper>
        <PostIcon />
      </IconWrapper>
      <TextWrapper>
        <CafeDetailsText cafe={cafe} />
      </TextWrapper>
      <div>내용 추가</div>
      <div>내용 추가</div>
    </DetailContainer>
  );
};

export default CafeDetailInfo;
