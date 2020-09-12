import React from "react";
import "./index.css";
import { CafeInfo } from "../MainFeed";
import { openNaverApp } from "../WebSearch";
import { Link } from "react-router-dom";
import { PopupWrapper, linkCopied } from "../MainPopup";

type DetailPopupProps = {
  cafe: CafeInfo | null;
};

const DetailPopup = ({ cafe }: DetailPopupProps) => {
  return (
    <PopupWrapper className="pu-content-wrap">
      <button className="into-place">
        <Link to={`/place=${cafe?.place}`}> {cafe?.place} 검색</Link>
      </button>
      <button
        onClick={() => {
          const currentLink = `https://coffee-hmm.inhibitor.io/cafe/${cafe?.id}`;
          linkCopied(currentLink);
        }}
      >
        링크 복사
      </button>
      <button onClick={() => openNaverApp(cafe?.name + " " + cafe?.place)}>
        네이버 검색
      </button>
      <button>인스타그램 검색</button>
    </PopupWrapper>
  );
};

export default DetailPopup;
