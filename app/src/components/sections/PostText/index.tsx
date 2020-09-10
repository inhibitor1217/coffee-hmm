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
`;

const MenuContainer = styled.div`
  width: 300px;
  min-height: 180px;
  overflow: hidden;
  padding-bottom: 14px;
`;

type PostTextProps = {
  cafe: CafeInfo | null;
};

const PostText = ({ cafe }: PostTextProps) => {
  return (
    <div>
      <InfoContainer>
        <CafeBasicInfo cafe={cafe} />
      </InfoContainer>
      <MenuContainer className="menu-container">
        <h4 className="menu-header">카페 메뉴</h4>
        <MenuCategory menus={cafe?.menus} />
      </MenuContainer>
    </div>
  );
};

export default PostText;
