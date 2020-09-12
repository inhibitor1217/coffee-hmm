import React, { useState } from "react";
import { CafeInfo } from "../MainFeed";
import styled from "styled-components";
import PlaceHeader from "../PlaceHeader";
import CafePreviewList from "../CafePreviewList";
import PlaceStats from "../PlaceStats";
import MaterialIcon from "../../common/MaterialIcon";
import "./index.css";
import SquareArrange from "../SquareArrange";
import NoresultForm from "../NoresultForm";

const PContainer = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
`;

const PlaceFeedTop = styled.div`
  width: 360px;
  margin: 0 auto;
`;

const PWrapper = styled.div`
  width: 360px;
  border: 1px solid #dbdbdb;
  margin: 0 auto;
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
`;

const SquareBox = styled.span`
  min-width: 118px;
  min-height: 118px;
  border: 1px solid #ffffff;
  text-align: center;
`;

type PlaceFeedProps = {
  searchedCafeList: CafeInfo[] | null;
  placeName: string;
};

const PlaceFeed = ({ searchedCafeList, placeName }: PlaceFeedProps) => {
  const [isToggleOn, setToggle] = useState<boolean>(true);
  if (searchedCafeList === null) {
    return <NoresultForm data={placeName} />;
  }
  return (
    <PContainer>
      <PlaceFeedTop>
        <PlaceHeader placeName={placeName} />
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
              setToggle((isToggleOn) => !isToggleOn);
            }}
          >
            {isToggleOn ? (
              <MaterialIcon icon="keyboard_arrow_down" />
            ) : (
              <MaterialIcon icon="keyboard_arrow_up" />
            )}
          </button>
        </div>
        <PlaceStats cafes={searchedCafeList} />
      </PlaceFeedTop>
      <PWrapper>
        {searchedCafeList.map((cafe) => {
          return (
            <SquareBox key={cafe.id}>
              <SquareArrange cafeId={cafe.id} cafeImg={cafe.mainImageUri} />
            </SquareBox>
          );
        })}
      </PWrapper>
    </PContainer>
  );
};

export default PlaceFeed;
