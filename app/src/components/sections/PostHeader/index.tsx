import React, { useState } from "react";
import styled from "styled-components";
import "./index.css";
import { Link, useHistory } from "react-router-dom";
import MaterialIcon from "../../common/MaterialIcon";
import { CafeInfo } from "../../../utils";
import DetailPopup from "../DetailPopup";

const HeaderWrapper = styled.div`
  width: 360px;
  height: 54px;
`;

type PostHeaderProps = {
  cafe: CafeInfo | null;
  fromDetail: boolean;
};

const PostHeader = ({ cafe, fromDetail }: PostHeaderProps) => {
  const history = useHistory();
  const [popupActive, setPopupActive] = useState<boolean>(false);

  const showPopup = () => {
    setPopupActive(true);
  };
  const closePopup = () => {
    setPopupActive(false);
  };

  return (
    <HeaderWrapper>
      {fromDetail ? (
        <div
          className="cafe-header-box"
          style={{ position: "fixed", top: "0", zIndex: 999 }}
        >
          <button className="post-back-button" onClick={() => history.goBack()}>
            <MaterialIcon icon="keyboard_arrow_left" />
          </button>
          <span
            className="material-icons cafe-header-menu click-here"
            onClick={showPopup}
          >
            more_horiz
          </span>
          <Link to={`/cafe/${cafe?.id}`}>
            <div className="cafe-header-name">{cafe?.name}</div>
          </Link>
        </div>
      ) : (
        <div className="cafe-header-box">
          <div className="cafe-header-icon">
            <img src={"https://" + cafe?.mainImageUri} alt={cafe?.name} />
          </div>
          <Link to={`/cafe/${cafe?.id}`}>
            <div className="cafe-header-name">{cafe?.name}</div>
          </Link>
        </div>
      )}

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
            <DetailPopup cafe={cafe} />
          </div>
        </div>
        <div className="bg-overlay" onClick={closePopup}></div>
      </div>
    </HeaderWrapper>
  );
};

export default PostHeader;
