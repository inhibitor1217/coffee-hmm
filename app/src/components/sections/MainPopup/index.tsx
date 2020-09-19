import React from "react";
import "./index.css";
import { Link } from "react-router-dom";
import CopyToClipboard from "react-copy-to-clipboard";
import { PopupWrapper, copyLink, openSearch, CafeInfo } from "../../../utils";

type MainPopupProps = {
  cafe: CafeInfo | null;
};

const MainPopup = ({ cafe }: MainPopupProps) => {
  const currentLink = `https://coffee-hmm.inhibitor.io/cafe/${cafe?.id}`;

  return (
    <PopupWrapper className="pu-content-wrap">
      <button className="into-cafe">
        <Link to={`/cafe/${cafe?.id}`}>카페 보기 </Link>
      </button>
      <CopyToClipboard text={currentLink}>
        <button onClick={() => copyLink(cafe?.name)}>링크 복사</button>
      </CopyToClipboard>
      <button
        onClick={() => openSearch(cafe?.name + " " + cafe?.place, "Naver")}
      >
        네이버 검색
      </button>
      <button
        onClick={() =>
          openSearch(cafe?.name === undefined ? " " : cafe?.name, "Instagram")
        }
      >
        인스타그램 검색
      </button>
    </PopupWrapper>
  );
};

export const linkCopied = (currentLink: string) => {
  window.confirm(currentLink + "\n 링크 복사");
};

export default MainPopup;
