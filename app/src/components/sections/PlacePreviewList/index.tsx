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
  justify-content: flex-start;
`;

const TextBox = styled.span`
  min-width: 60px;
  padding: 4px 0px;
  text-align: center;
`;

type PlacePreviewListProps = {
  places: string[];
};

const PlacePreviewList = ({ places }: PlacePreviewListProps) => {
  return (
    <PreviewWrapper>
      <div className="place-preview-header">
        Suggested for you..
        <Link to="/places">
          <span className="place-preview-more">more</span>
        </Link>
      </div>
      <TextWrapper>
        {places?.map((place) => {
          return (
            <TextBox key={place}>
              <Link to={`/place/${place}`} className="place-preview-text">
                # {place}카페
              </Link>
            </TextBox>
          );
        })}
      </TextWrapper>
    </PreviewWrapper>
  );
};

export default PlacePreviewList;
