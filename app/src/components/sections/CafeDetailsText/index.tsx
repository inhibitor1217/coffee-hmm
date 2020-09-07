import React from "react";
import "./index.css";
import MenuCategory from "../MenuCategory";
import { CafeInfo } from "../MainFeed";
import CafeBasicInfo from "../CafeBasicInfo";
import styled from "styled-components";

const InfoContainer = styled.div`
  width: 300px;
  height: 40px;
  padding-bottom: 10px;
`;

const MenuContainer = styled.div`
  width: 300px;
  height: 200px;
  margin-bottom: 10px;
  overflow: hidden;
`;

type CafeDetailsProps = {
  cafe: CafeInfo | null;
};

const CafeDetailsText = ({ cafe }: CafeDetailsProps) => {
  return (
    <div>
      <InfoContainer>
        <CafeBasicInfo cafe={cafe} />
      </InfoContainer>
      <MenuContainer className="menu-container">
        <h4 className="menu-header">Cafe Menu</h4>
        <MenuCategory menus={cafe?.menus} />
      </MenuContainer>
    </div>
  );
};

export default CafeDetailsText;
