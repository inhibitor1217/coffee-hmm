import React from "react";
import "./index.css";
import MenuCategory from "../MenuCategory";
import { CafeInfo } from "../MainFeed";
import CafeBasicInfo from "../CafeBasicInfo";
import styled from "styled-components";

const InfoContainer = styled.div`
  width: 300px;
  min-height: 40px;
  padding-bottom: 14px;
  display: flex;
  align-items: stretch;
  flex-direction: column;
`;

export const BasicInfoBox = styled.div`
  display: flex;
  padding-bottom: 8px;
`;

const MenuContainer = styled.div`
  width: 300px;
  min-height: 180px;
  overflow: hidden;
  padding-bottom: 14px;
`;

type CafeDetailsProps = {
  cafe: CafeInfo | null;
};

const CafeDetailsText = ({ cafe }: CafeDetailsProps) => {
  return (
    <div>
      <InfoContainer>
        <CafeBasicInfo cafe={cafe} />
        <BasicInfoBox>
          <span className="binfo-time">OPEN</span>
          <span className="binfo-value"> 8:00 ~ 19:00</span>
        </BasicInfoBox>
      </InfoContainer>
      <MenuContainer className="menu-container">
        <h4 className="menu-header">카페 메뉴</h4>
        <MenuCategory menus={cafe?.menus} />
      </MenuContainer>
    </div>
  );
};

export default CafeDetailsText;
