import React from "react";
import CafeImageSlide from "../CafeImageSlide";
import styled from "styled-components";
import PostHeader from "../PostHeader";
import { CafeInfo } from "../MainFeed";
import PostIcon from "../PostIcon";
import PostText from "../PostText";

const ArticleContainer = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  overflow: hidden;
`;

export const ImageWrapper = styled.div`
  width: 360px;
  margin: auto;
  box-shadow: 0px 1px 9px 1px rgba(199, 198, 198, 0.75);
  position: relative;
`;

export const TextWrapper = styled.div`
  width: 360px;
  margin: auto;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
`;

export const IconWrapper = styled.div`
  width: 360px;
  margin: auto;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
`;

type PostContentsProps = {
  cafe: CafeInfo | null;
};

const Post = ({ cafe }: PostContentsProps) => {
  return (
    <ArticleContainer>
      <PostHeader cafe={cafe} fromDetail={false} />
      <ImageWrapper>
        <CafeImageSlide cafe={cafe} />
      </ImageWrapper>
      <IconWrapper>
        <PostIcon />
      </IconWrapper>
      <TextWrapper>
        <PostText cafe={cafe} />
      </TextWrapper>
    </ArticleContainer>
  );
};

export default Post;
