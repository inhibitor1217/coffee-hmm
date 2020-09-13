import React from "react";
import "./index.css";
import { CafeInfo } from "../MainFeed";
import { openSearch } from "../WebSearch";
import { Link } from "react-router-dom";
import { PopupWrapper } from "../MainPopup";
import CopyToClipboard from "react-copy-to-clipboard";
import { copiedLink } from "../PostHeader";

type DetailPopupProps = {
  cafe: CafeInfo | null;
};

const DetailPopup = ({ cafe }: DetailPopupProps) => {
  const currentLink = `https://coffee-hmm.inhibitor.io/cafe/${cafe?.id}`;

  return (
    <PopupWrapper className="pu-content-wrap">
      <button className="into-place">
        <Link to={`/place=${cafe?.place}`}> {cafe?.place} 검색</Link>
      </button>
      <CopyToClipboard text={currentLink}>
        <button onClick={() => copiedLink(cafe?.name)}>링크 복사</button>
      </CopyToClipboard>
      <button
        onClick={() => openSearch(cafe?.name + " " + cafe?.place, "Naver")}
      >
        네이버 검색
      </button>
      <button>인스타그램 검색</button>
    </PopupWrapper>
  );
};

export default DetailPopup;
