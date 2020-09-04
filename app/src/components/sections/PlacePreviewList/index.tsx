import React from "react";
import styled from "styled-components";
import "./index.css";
import { Link } from "react-router-dom";

const PreviewWrapper = styled.div`
  padding: 10px 4px;
  background-color: #fafafa;
`;

const TextWrapper = styled.div`
  width: 340px;
  margin: 0 auto;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
`;

const TextBox = styled.span`
  min-width: 60px;
  padding: 4px 0px;
  text-align: center;
`;

type PlacePreviewListProps = {
  currentSpot: string | undefined;
};

const PlacePreviewList = ({ currentSpot }: PlacePreviewListProps) => {
  return (
    <PreviewWrapper>
      <div className="place-preview-header">Suggested for you..</div>
      <TextWrapper>
        {popularPlaces.map((spot) => {
          return (
            <TextBox>
              <Link to={`/${spot}`} className="place-preview-text">
                # {spot}카페
              </Link>
            </TextBox>
          );
        })}
      </TextWrapper>
    </PreviewWrapper>
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

export default PlacePreviewList;
