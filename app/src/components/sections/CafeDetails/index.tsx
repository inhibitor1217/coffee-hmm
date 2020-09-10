import React from "react";
import { CafeInfo } from "../MainFeed";
import styled from "styled-components";
import CafeImageSlide from "../CafeImageSlide";
import PostIcon from "../PostIcon";
import CafeDetailsText from "../CafeDetailsText";
import { ImageWrapper, IconWrapper, TextWrapper } from "../PostContents";
import WebSearch from "../WebSearch";
import PostHeader from "../PostHeader";

const DetailContainer = styled.div`
  display: flex;
  align-items: stretch;
  justify-content: center;
  flex-direction: column;
`;

const WebSearchWrapper = styled.div`
  width: 300px;
  margin: 0 auto;
`;

type CafeDetailInfoProps = {
  cafe: CafeInfo | null;
};

const CafeDetails = ({ cafe }: CafeDetailInfoProps) => {
  return (
    <DetailContainer>
      <PostHeader cafe={cafe} fromDetail={true} />
      <ImageWrapper>
        <CafeImageSlide cafe={cafe} />
      </ImageWrapper>
      <IconWrapper>
        <PostIcon />
      </IconWrapper>
      <TextWrapper>
        <CafeDetailsText cafe={cafe} />
      </TextWrapper>
      <WebSearchWrapper>
        <WebSearch cafe={cafe} />
      </WebSearchWrapper>
    </DetailContainer>
  );
};

export default CafeDetails;
