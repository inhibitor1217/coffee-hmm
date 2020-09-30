import React from "react";
import styled from "styled-components";
import "./index.css";
import { openSearch, CafeInfo } from "../../../utils";

const IconsContainer = styled.div`
  width: 360px;
  height: 40px;
`;

type PostIconProps = {
  cafe: CafeInfo | null;
};

const PostIcon = ({ cafe }: PostIconProps) => {
  let searchedData = "";
  if (cafe != null) {
    searchedData = cafe.name + " " + cafe.place;
  }

  return (
    <IconsContainer>
      <span className="material-icons-outlined visibility-icon">
        visibility
      </span>
      <span className="view-count">{cafe?.viewCount}</span>
      <span
        className="N-icon "
        onClick={() => openSearch(searchedData, "Naver")}
      >
        <img
          src="/images/logo/naver-icon.png"
          alt="Naver"
          style={{
            width: "28px",
            height: "28px",
            background: "transparent",
            margin: "2px",
          }}
        />
      </span>
      <span
        className="I-icon"
        onClick={() =>
          openSearch(cafe?.name === undefined ? " " : cafe?.name, "Instagram")
        }
      >
        <img
          src="/images/logo/insta-icon.png"
          alt="I"
          style={{
            width: "28px",
            height: "28px",
            background: "transparent",
            margin: "2px",
          }}
        />
      </span>
    </IconsContainer>
  );
};

export default PostIcon;
