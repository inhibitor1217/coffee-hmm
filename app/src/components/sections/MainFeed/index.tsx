import React from "react";
import styled from "styled-components";
import Post from "../Post";

const MContainer = styled.div`
  display: flex;
  align-items: stretch;
  justify-content: center;
  flex-direction: column;
`;

const FeedBox = styled.div`
  width: 360px;
  border: 1px solid #dbdbdb;
  margin: 10px auto;
  align-items: stretch;
  flex: 0 0 360px;
`;

export type CafeInfo = {
  id: string;
  name: string;
  imageUris: string[];
  mainImageUri: string;
  lat: number;
  lng: number;
  americanoPrice: number;
  floor: number;
  specialMenu: string;
  specialMenuPrice: number;
  logo: boolean;
};

type MainFeedProps = {
  mainCafeList: CafeInfo[] | null;
};

const MainFeed = ({ mainCafeList }: MainFeedProps) => {
  return (
    <MContainer>
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

export default MainFeed;
