import React from "react";
import "./index.css";
import styled from "styled-components";
import { CafeInfo } from "../MainFeed";
import { openSearch } from "../../../utils";

const SearchWrapper = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
`;

const SearchBox = styled.div`
  min-width: 220px;
  display: flex;
  align-items: center;
  position: relative;
`;

type WebSearchProps = {
  cafe: CafeInfo | null;
};

const WebSearch = ({ cafe }: WebSearchProps) => {
  let searchedData = "";
  if (cafe != null) {
    searchedData = cafe.name + " " + cafe.place;
  }

  return (
    <div>
      <div className="web-search-text">상세검색</div>
      <SearchWrapper>
        <SearchBox>
          <span className="NI-icons">
            <img src="/images/logo/naver-icon.png" alt="Naver" />
          </span>
          <input
            className="search-input-box"
            type="text"
            placeholder={cafe?.name + " " + cafe?.place + " 검색"}
          />
          <button
            className="web-button"
            onClick={() => openSearch(searchedData, "Naver")}
          >
            go
          </button>
        </SearchBox>
        <SearchBox>
          <span className="NI-icons">
            <img src="/images/logo/insta-icon.png" alt="I" />
          </span>
          <input
            className="search-input-box"
            type="text"
            placeholder={"#" + cafe?.name + " 검색"}
          />
          <button
            className="web-button"
            onClick={() =>
              openSearch(
                cafe?.name === undefined ? " " : cafe?.name,
                "Instagram"
              )
            }
          >
            go
          </button>
        </SearchBox>
      </SearchWrapper>
    </div>
  );
};

export default WebSearch;
