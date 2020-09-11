import React from "react";
import CafeImageSlide from "../CafeImageSlide";
import PostHeader from "../PostHeader";
import { CafeInfo } from "../MainFeed";
import PostIcon from "../PostIcon";
import {
  CafeInfoWrapper,
  MenuContainer,
  DetailContainer,
  ImageWrapper,
  IconWrapper,
} from "../CafeDetails";
import CafeBasicInfo from "../CafeBasicInfo";
import MenuCategory from "../MenuCategory";

type PostContentsProps = {
  cafe: CafeInfo | null;
};

const Post = ({ cafe }: PostContentsProps) => {
  return (
    <DetailContainer>
      <PostHeader cafe={cafe} fromDetail={false} />
      <ImageWrapper>
        <CafeImageSlide cafe={cafe} />
      </ImageWrapper>
      <IconWrapper>
        <PostIcon />
      </IconWrapper>
      <CafeInfoWrapper>
        <CafeBasicInfo cafe={cafe} />
        <MenuContainer className="menu-container">
          <div className="menu-header">카페 메뉴</div>
          <MenuCategory menus={cafe?.menus} />
        </MenuContainer>
      </CafeInfoWrapper>
    </DetailContainer>
  );
};

export default Post;
