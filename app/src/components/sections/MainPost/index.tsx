import React from "react";
import CafeImageSlide from "../CafeImageSlide";
import PostHeader from "../PostHeader";
import PostIcon from "../PostIcon";
import CafeBasicInfo from "../CafeBasicInfo";
import {
  DetailContainer,
  ImageWrapper,
  IconWrapper,
  CafeInfoWrapper,
  CafeInfo,
} from "../../../utils";

type MainPostProps = {
  cafe: CafeInfo | null;
};

const MainPost = ({ cafe }: MainPostProps) => {
  return (
    <DetailContainer>
      <PostHeader cafe={cafe} fromDetail={false} />
      <ImageWrapper>
        <CafeImageSlide cafe={cafe} />
      </ImageWrapper>
      <IconWrapper>
        <PostIcon cafe={cafe} />
      </IconWrapper>
      <CafeInfoWrapper>
        <CafeBasicInfo cafe={cafe} />
      </CafeInfoWrapper>
    </DetailContainer>
  );
};

export default MainPost;
