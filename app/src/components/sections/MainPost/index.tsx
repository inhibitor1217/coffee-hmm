import React from "react";
import CafeImageSlide from "../CafeImageSlide";
import PostHeader from "../PostHeader";
import PostIcon from "../PostIcon";
import CafeBasicInfo from "../CafeBasicInfo";
import MenuCategory from "../CafeMenu";
import {
  DetailContainer,
  ImageWrapper,
  IconWrapper,
  CafeInfoWrapper,
  MenuContainer,
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
        <MenuContainer className="menu-container">
          <div className="menu-header">카페 메뉴</div>
          <MenuCategory menus={cafe?.menus} />
        </MenuContainer>
      </CafeInfoWrapper>
    </DetailContainer>
  );
};

export default MainPost;
