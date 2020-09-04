import React from "react";
import CafeImageSlide from "../CafeImageSlide";
import CafeDetailsText from "../CafeDetailsText";
import styled from "styled-components";
import PostHeader from "../PostHeader";
import { CafeInfo } from "../MainFeed";
import PostIcon from "../PostIcon";

const ArticleContainer = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  overflow: hidden;
`;

export const ImageWrapper = styled.div`
  max-width: 360px;
  box-shadow: 0px 1px 9px 1px rgba(199, 198, 198, 0.75);
  position: relative;
`;

export const TextWrapper = styled.div`
  max-width: 360px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
`;

export const IconWrapper = styled.div`
  max-width: 360px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
`;

type PostContentsProps = {
  cafe: CafeInfo | null;
};

const PostContents = ({ cafe }: PostContentsProps) => {
  return (
    <ArticleContainer>
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
    </ArticleContainer>
  );
};

export default PostContents;
