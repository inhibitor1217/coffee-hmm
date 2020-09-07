import React from "react";
import styled from "styled-components";
import Post from "../Post";
import PlacePreviewList from "../PlacePreviewList";
import { Menus } from "../MenuCategory";

const MContainer = styled.div`
  display: flex;
  align-items: stretch;
  justify-content: center;
  flex-direction: column;
`;

const FeedTop = styled.div`
  width: 360px;
  border: 1px solid #dbdbdb;
  margin: 0 auto;
  margin-bottom: 10px;
`;

const FeedBox = styled.div`
  width: 360px;
  border: 1px solid #dbdbdb;
  margin: 10px auto;
  align-items: stretch;
  flex: 0 0 360px;
`;

export type PlaceInfo = {
  placeCategory: string;
  cafes: CafeInfo[];
};

export type CafeInfo = {
  id: string;
  name: string;
  imageUris: string[];
  mainImageUri: string;
  americanoPrice: number;
  floor: number;
  menus: Menus;
};

type MainFeedProps = {
  mainCafeList: CafeInfo[] | null;
};

const MainFeed = ({ mainCafeList }: MainFeedProps) => {
  return (
    <MContainer>
      <FeedTop>
        <PlacePreviewList placeCategories={popularPlaces} />
      </FeedTop>

      {mainCafeList?.map((cafe) => {
        return (
          <FeedBox key={cafe.id}>
            <Post cafeId={cafe.id} />
          </FeedBox>
        );
      })}
    </MContainer>
  );
};

let popularPlaces = [
  "한남",
  "연남",
  "성수",
  "건대입구",
  "강남",
  "잠실",
  "남양주",
  "샤로수길",
  "판교",
];

export default MainFeed;
