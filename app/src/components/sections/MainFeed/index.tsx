import React from "react";
import styled from "styled-components";
import PlacePreviewList from "../PlacePreviewList";
import { Menus } from "../MenuCategory";
import Post from "../MainPostContents";

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
  place: string;
  imageUris: string[];
  mainImageUri: string;
  americanoPrice: number;
  floor: number;
  menus: Menus;
};

type MainFeedProps = {
  cafeList: CafeInfo[] | null;
};

const getPlaceCategories = (cafeList: CafeInfo[] | null) => {
  const placeSet = new Set<string>();
  cafeList?.forEach((cafe) => {
    placeSet.add(cafe.place);
  });
  const placeArray = [...placeSet];
  return placeArray;
};

const MainFeed = ({ cafeList }: MainFeedProps) => {
  return (
    <MContainer>
      <FeedTop>
        <PlacePreviewList places={getPlaceCategories(cafeList)} />
      </FeedTop>

      {cafeList?.map((cafe) => {
        return (
          <FeedBox key={cafe.id}>
            <Post cafe={cafe} />
          </FeedBox>
        );
      })}
    </MContainer>
  );
};

export default MainFeed;
