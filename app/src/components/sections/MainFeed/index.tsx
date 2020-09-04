import React, { useState } from "react";
import styled from "styled-components";
import Post from "../Post";
import PlacePreviewList from "../PlacePreviewList";
import { Link } from "react-router-dom";
import "./index.css";

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

const SearchBox = styled.div`
  z-index: 9999;
  position: absolute;
  top: 12px;
  left: 35%;
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

const handleSubmit = (event: React.SyntheticEvent) => {
  event.preventDefault();
};

const MainFeed = ({ mainCafeList }: MainFeedProps) => {
  const [currentSpot, setCurrentSpot] = useState<string | undefined>();

  const searchSpot = (event: React.SyntheticEvent) => {
    setCurrentSpot((event.target as HTMLTextAreaElement).value);
  };

  return (
    <MContainer>
      <SearchBox>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="search"
            value={currentSpot}
            onChange={searchSpot}
            onKeyPress={searchSpot}
            className="search-box"
          />
          <Link to={`/${currentSpot}`}>
            <button type="submit" className="search-button"></button>
          </Link>
        </form>
      </SearchBox>
      <FeedTop>
        <PlacePreviewList />
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

export default MainFeed;
