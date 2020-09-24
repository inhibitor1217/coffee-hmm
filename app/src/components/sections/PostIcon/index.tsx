import React, { useState } from "react";
import styled from "styled-components";
import "./index.css";
import ImageSavePopup from "../ImageSavePopup";
import { useLocation } from "react-router";
import { openSearch, CafeInfo } from "../../../utils";

const IconsContainer = styled.div`
  width: 360px;
  height: 40px;
`;

type PostIconProps = {
  cafe: CafeInfo | null;
};

const PostIcon = ({ cafe }: PostIconProps) => {
  const location = useLocation();
  const [popupActive, setPopupActive] = useState<boolean>(false);
  const showPopup = () => {
    setPopupActive(true);
  };
  const closePopup = () => {
    setPopupActive(false);
  };

  let searchedData = "";
  if (cafe != null) {
    searchedData = cafe.name + " " + cafe.place;
  }

  return (
    <IconsContainer>
      <span className="material-icons-outlined visibility-icon">
        visibility
      </span>
      <span className="material-icons-outlined save-icon" onClick={showPopup}>
        perm_media
      </span>
      {!location.pathname.includes("/cafe") && (
        <div>
          <span
            className="N-icon NI-icons"
            onClick={() => openSearch(searchedData, "Naver")}
          >
            <img src="/images/logo/naver-icon.png" alt="Naver" />
          </span>
          <span
            className="I-icon NI-icons"
            onClick={() =>
              openSearch(
                cafe?.name === undefined ? " " : cafe?.name,
                "Instagram"
              )
            }
          >
            <img src="/images/logo/insta-icon.png" alt="I" />
          </span>
        </div>
      )}

      <div
        className={
          popupActive ? "pop-up-container container-open" : "pop-up-container"
        }
      >
        <div className="pop-up-wrap save-pop-up-wrap">
          <div className="save-close-btn" onClick={closePopup}>
            close
          </div>
          <div className="pop-up-box save-pop-up-box">
            <div className="pop-up-content-wrap">
              <ImageSavePopup cafe={cafe} />
            </div>
          </div>
        </div>
        <div className="bg-overlay" onClick={closePopup}></div>
      </div>
    </IconsContainer>
  );
};

export default PostIcon;
