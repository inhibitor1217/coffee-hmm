import React from "react";
import styled from "styled-components";
import { VariableSizeList } from "react-window";
import PlacePreviewList from "../PlacePreviewList";
import MainPost from "../MainPost";
import "./index.css";
import MaterialIcon from "../../common/MaterialIcon";
import { CafeInfo } from "../../../utils";

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

type MainFeedProps = {
  cafeList: CafeInfo[] | null;
};

const getPlaceCategories = (cafeList: CafeInfo[] | null) => {
  const placeArray = cafeList?.map((cafe) => cafe.place);
  const placeSet = new Set<string>(placeArray);
  return [...placeSet];
};

const FEED_LIST_VISIBLE_HEIGHT = 1000;
const FEED_TOP_SEMANTIC_HEIGHT = 75;
const FEED_BOX_SEMANTIC_HEIGHT = 720;

const MainFeed = ({ cafeList }: MainFeedProps) => {
  return (
    <MContainer>
      <button className="top-button">
        <MaterialIcon icon="keyboard_arrow_up" />
      </button>
      {cafeList && (
        <VariableSizeList
          itemCount={cafeList.length + 1}
          width="100%"
          height={FEED_LIST_VISIBLE_HEIGHT}
          itemSize={(index) =>
            index ? FEED_BOX_SEMANTIC_HEIGHT : FEED_TOP_SEMANTIC_HEIGHT
          }
          style={{ overflowX: "hidden" }}
        >
          {({ index, style }) =>
            index ? (
              <div style={style}>
                <FeedBox>
                  <MainPost cafe={cafeList[index - 1]} />
                </FeedBox>
              </div>
            ) : (
              <FeedTop style={style}>
                <PlacePreviewList places={getPlaceCategories(cafeList)} />
              </FeedTop>
            )
          }
        </VariableSizeList>
      )}
    </MContainer>
  );
};

export default MainFeed;
