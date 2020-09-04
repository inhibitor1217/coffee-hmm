import React, { useState } from "react";
import { CafeInfo } from "../MainFeed";
import SquareArrange from "../SquareArrange";
import styled from "styled-components";
import SpotHeader from "../SpotHeader";
import CafePreviewList from "../CafePreviewList";
import SpotStats from "../SpotStats";
import MaterialIcon from "../../common/MaterialIcon";
import "./index.css";

const SContainer = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
`;

const SpotFeedTop = styled.div`
  width: 360px;
  margin: 0 auto;
`;

const SWrapper = styled.div`
  width: 360px;
  border: 1px solid #dbdbdb;
  margin: 0 auto;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  align-content: space-around;
`;

const SquareBox = styled.span`
  min-width: 118px;
  min-height: 118px;
  border: 1px solid #ffffff;
`;

type CafeSpotFeedProps = {
  searchedCafeList: CafeInfo[] | null;
  spotName: string;
};

const CafeSpotFeed = ({ searchedCafeList, spotName }: CafeSpotFeedProps) => {
  const [isToggleOn, setToggle] = useState<boolean>(true);

  return (
    <SContainer>
      <SpotFeedTop>
        <SpotHeader spotName={spotName} />
        <div
          className="preview-box"
          style={{
            maxHeight: isToggleOn ? "80px" : "900px",
          }}
        >
          <CafePreviewList cafes={searchedCafeList} />
          <button
            className="toggle-button"
            onClick={() => {
              if (isToggleOn) {
                setToggle(false);
              } else {
                setToggle(true);
              }
            }}
          >
            {isToggleOn ? (
              <MaterialIcon icon="keyboard_arrow_down" />
            ) : (
              <MaterialIcon icon="keyboard_arrow_up" />
            )}
          </button>
        </div>
        <SpotStats cafes={searchedCafeList} />
      </SpotFeedTop>
      <SWrapper>
        {searchedCafeList?.map((cafe) => {
          return (
            <SquareBox key={cafe.id}>
              <SquareArrange cafeId={cafe.id} cafeImg={cafe.mainImageUri} />
            </SquareBox>
          );
        })}
      </SWrapper>
    </SContainer>
  );
};

export default CafeSpotFeed;
