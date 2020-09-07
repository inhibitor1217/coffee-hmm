import React from "react";
import CafeImageSlide from "../CafeImageSlide";
import CafeDetailsText from "../CafeDetailsText";
import styled from "styled-components";
import PostHeader from "../PostHeader";
import { CafeInfo } from "../MainFeed";
import PostIcon from "../PostIcon";

const ImageWrapper = styled.div`
  box-shadow: 0px 1px 9px 1px rgba(199, 198, 198, 0.75);
  position: relative;
`;

const TextWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
`;

const IconWrapper = styled.div`
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
    <div>
      <PostHeader cafeName={cafe?.name} />
      <ImageWrapper>
        <CafeImageSlide cafe={cafe} />
      </ImageWrapper>
      <IconWrapper>
        <PostIcon />
      </IconWrapper>
      <TextWrapper>
        <CafeDetailsText cafe={cafe} />
      </TextWrapper>
    </div>
  );
};

export default PostContents;
