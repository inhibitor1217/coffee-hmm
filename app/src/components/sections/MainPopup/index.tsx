import React from "react";
import styled from "styled-components";
import "./index.css";
import { CafeInfo } from "../MainFeed";
import { openSearch } from "../WebSearch";
import { Link } from "react-router-dom";

export const PopupWrapper = styled.div`
  display: flex;
  align-items: stretch;
  justify-content: center;
  flex-direction: column;
`;

type MainPopupProps = {
  cafe: CafeInfo | null;
};

const MainPopup = ({ cafe }: MainPopupProps) => {
  return (
    <PopupWrapper className="pu-content-wrap">
      <button className="into-cafe">
        <Link to={`/cafe/${cafe?.id}`}>카페 보기 </Link>
      </button>
      <button
        onClick={() => {
          const currentLink = `https://coffee-hmm.inhibitor.io/cafe/${cafe?.id}`;
          linkCopied(currentLink);
        }}
      >
        링크 복사
      </button>
      <button
        onClick={() => openSearch(cafe?.name + " " + cafe?.place, "Naver")}
      >
        네이버 검색
      </button>
      <button>인스타그램 검색</button>
    </PopupWrapper>
  );
};

export const linkCopied = (currentLink: string) => {
  window.confirm(currentLink + "\n 링크 복사");
};

export default MainPopup;
