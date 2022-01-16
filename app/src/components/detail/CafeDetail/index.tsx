import React from "react";
import CopyToClipboard from "react-copy-to-clipboard";

import { Cafe } from "types/common/model";
import { copyLink, openSearch } from "utils";
import { StyledColumnFlex } from "utils/styled";

import CafeDetailImageCarousel from "../CafeDetailImageCarousel";

import "./index.css";

type CafeDetailProps = {
  cafe: Cafe | null;
  setCafe: (cafe: Cafe | null) => void;
};

const CafeDetail = ({ cafe }: CafeDetailProps) => {
  const currentCopyLink = `https://coffee-hmm.inhibitor.io/cafe/${cafe?.id}`;

  return (
    <div>
      <CafeDetailImageCarousel cafe={cafe} />

      <StyledColumnFlex>
        <div className="detail-info">
          <span className="detail-name">{cafe?.name}</span>
          <span className="detail-place">{cafe?.place.name}</span>
          <span className="detail-time">OPEN {cafe?.metadata?.hour}</span>
        </div>

        <div className="detail-button-wrapper">
          <div className="detail-button">
            <CopyToClipboard text={currentCopyLink}>
              <button
                className="detail-share"
                onClick={() => copyLink(cafe?.name)}
              >
                <img src="/icons/share-icon.png" alt="share" />
              </button>
            </CopyToClipboard>
            <span>
              흠 링크
              <br />
              공유하기
            </span>
          </div>
          <div
            className="detail-button"
            onClick={() =>
              openSearch((cafe?.name || "") + " " + cafe?.place.name, "Naver")
            }
          >
            <button className="detail-naver">
              <img src="/images/naver-icon.png" alt="naver" />
            </button>
            <span>
              네이버 검색
              <br />
              바로가기
            </span>
          </div>
          <div
            className="detail-button"
            onClick={() => openSearch(cafe?.name || "", "Instagram")}
          >
            <button className="detail-insta">
              <img src="/images/insta-icon.png" alt="insta" />
            </button>
            <span>
              인스타그램
              <br />
              바로가기
            </span>
          </div>
        </div>
      </StyledColumnFlex>
    </div>
  );
};

export default React.memo(CafeDetail);
