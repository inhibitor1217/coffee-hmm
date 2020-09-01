import React from "react";
import { CafeInfo } from "../MainFeed";
import SquareArrange from "../SquareArrange";
import styled from "styled-components";

const SContainer = styled.div`
  display: flex;
  justify-content: center;
`;

const SWrapper = styled.div`
  width: 360px;
  border: 1px solid #dbdbdb;
  margin: 10px auto;
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
};

const CafeSpotFeed = ({ searchedCafeList }: CafeSpotFeedProps) => {
  return (
    <SContainer>
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
