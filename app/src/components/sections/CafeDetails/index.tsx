import React from "react";
import { CafeInfo } from "../MainFeed";
import styled from "styled-components";
import CafeImageSlide from "../CafeImageSlide";
import PostIcon from "../PostIcon";
import WebSearch from "../WebSearch";
import PostHeader from "../PostHeader";
import CafeBasicInfo from "../CafeBasicInfo";
import MenuCategory from "../MenuCategory";
import "./index.css";

export const DetailContainer = styled.div`
  display: flex;
  align-items: stretch;
  justify-content: center;
  flex-direction: column;
`;

export const ImageWrapper = styled.div`
  width: 360px;
  margin: auto;
  box-shadow: 0px 1px 9px 1px rgba(199, 198, 198, 0.75);
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

export const CafeInfoWrapper = styled.div`
  width: 300px;
  margin: 0 auto;
  padding-bottom: 14px;
  display: flex;
  align-items: stretch;
  flex-direction: column;
`;

export const InfoRow = styled.div`
  display: flex;
  padding-bottom: 8px;
`;

export const MenuContainer = styled.div`
  width: 300px;
  min-height: 180px;
  overflow: hidden;
  padding-bottom: 14px;
  position: relative;
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
      <CafeInfoWrapper>
        <CafeBasicInfo cafe={cafe} />
        <InfoRow>
          <span className="binfo-time">OPEN</span>
          <span className="binfo-value"> 8:00 ~ 19:00</span>
        </InfoRow>
        <WebSearch cafe={cafe} />
        <MenuContainer className="menu-container">
          <div className="menu-header">카페 메뉴</div>
          <MenuCategory menus={cafe?.menus} />
        </MenuContainer>
      </CafeInfoWrapper>
    </DetailContainer>
  );
};

export default CafeDetails;
