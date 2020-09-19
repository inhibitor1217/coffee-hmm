import React from "react";
import CafeImageSlide from "../CafeImageSlide";
import PostIcon from "../PostIcon";
import WebSearch from "../WebSearch";
import PostHeader from "../PostHeader";
import CafeBasicInfo from "../CafeBasicInfo";
import CafeMenu from "../CafeMenu";
import "./index.css";
import {
  DetailContainer,
  ImageWrapper,
  IconWrapper,
  CafeInfoWrapper,
  InfoRow,
  MenuContainer,
  CafeInfo,
} from "../../../utils";

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
        <PostIcon cafe={cafe} />
      </IconWrapper>
      <CafeInfoWrapper>
        <CafeBasicInfo cafe={cafe} />
        <InfoRow>
          <span className="binfo-time">OPEN</span>
          <span className="binfo-value"> 8:00 ~ 19:00</span>
        </InfoRow>
        <WebSearch cafe={cafe} />
        <MenuContainer className="menu-container">
          <div className="menu-header">카페 메뉴</div>
          <CafeMenu menus={cafe?.menus} />
        </MenuContainer>
      </CafeInfoWrapper>
    </DetailContainer>
  );
};

export default CafeDetails;
