import React from "react";
import styled from "styled-components";
import "./index.css";
import MaterialIcon from "../../common/MaterialIcon";

const PContainer = styled.div`
  display: flex;
  align-items: stretch;
  justify-content: center;
  flex-direction: column;
`;

const PlacesWrapper = styled.div`
  width: 360px;
  max-height: 310px;
  padding-top: 20px;
  overflow: auto;
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
`;

const PlaceBox = styled.span`
  min-width: 110px;
  min-height: 40px;
  padding: 4px;
  text-align: center;
`;

type PlaceGuideProps = {
  placeCategories: string[];
};

const PlaceGuide = ({ placeCategories }: PlaceGuideProps) => {
  return (
    <PContainer>
      <div className="place-guide-header">
        hmm suggests you
        <MaterialIcon icon="free_breakfast" size={18} />
      </div>
      <PlacesWrapper>
        {placeCategories.map((place, index) => {
          return (
            <PlaceBox className="place-guide-text" key={index}>
              #{place}카페
            </PlaceBox>
          );
        })}
      </PlacesWrapper>
    </PContainer>
  );
};

export default PlaceGuide;
