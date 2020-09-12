import React, { useState } from "react";
import styled from "styled-components";
import "./index.css";
import { Link } from "react-router-dom";
import MainPopup from "../MainPopup";
import { CafeInfo } from "../MainFeed";
import DetailPopup from "../DetailPopup";

const HeaderWrapper = styled.div`
  height: 54px;
  position: relative;
`;

type PostHeaderProps = {
  cafe: CafeInfo | null;
  fromDetail: boolean;
};

const PostHeader = ({ cafe, fromDetail }: PostHeaderProps) => {
  const [popupActive, setPopupActive] = useState<boolean>(false);
  const showPopup = () => {
    setPopupActive(true);
  };
  const closePopup = () => {
    setPopupActive(false);
  };

  return (
    <HeaderWrapper>
      <div className="cafe-header-icon-box">
        <span className="cafe-header-icon">
          <img
            src={"https://" + cafe?.mainImageUri}
            alt={cafe?.name}
            width="32px"
            height="32px"
          />
        </span>
      </div>
      <Link to={`/cafe/${cafe?.id}`}>
        <div className="cafe-header-name">{cafe?.name}</div>
      </Link>
      <span
        className="material-icons cafe-header-menu click-here"
        onClick={showPopup}
      >
        more_horiz
      </span>
      <div
        className={
          popupActive ? "pop-up-container container-open" : "pop-up-container"
        }
      >
        <div className="pop-up-wrap">
          <div className="close-btn" onClick={closePopup}>
            close
          </div>
          <div className="pop-up-box">
            <div className="pop-up-content-wrap">
              {fromDetail ? (
                <DetailPopup cafe={cafe} />
              ) : (
                <MainPopup cafe={cafe} />
              )}
            </div>
          </div>
        </div>
        <div className="bg-overlay" onClick={closePopup}></div>
      </div>
    </HeaderWrapper>
  );
};

export default PostHeader;
