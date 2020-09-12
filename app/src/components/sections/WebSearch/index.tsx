import React from "react";
import "./index.css";
import styled from "styled-components";
import { CafeInfo } from "../MainFeed";

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: center;
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
      <div className="web-search-text">검색결과 보기</div>
      <ButtonWrapper className="web-button">
        <button onClick={() => openSearch(searchedData, "Naver")}>
          <img
            src="/images/logo/naver_bi.png"
            alt="naver"
            style={{ width: "56px", height: "12px" }}
          />
        </button>
        <button
          onClick={() =>
            openSearch(cafe?.name === undefined ? " " : cafe?.name, "Instagram")
          }
        >
          <img
            src="/images/logo/insta_bi.png"
            alt="insta"
            style={{ width: "60px", height: "18px", paddingTop: "4px" }}
          />
        </button>
      </ButtonWrapper>
    </div>
  );
};

export const openSearch = (searchedData: string, searchEngine: string) => {
  const encodedData = encodeURIComponent(searchedData);
  const userAgent = navigator.userAgent;

  if (userAgent.match(/iPhone|iPad|iPod/i)) {
    setTimeout(function () {
      switch (searchEngine) {
        case "Naver":
          window
            .open(
              "https://m.search.naver.com/search.naver?query=" + encodedData,
              "_blank"
            )
            ?.focus();
          break;

        case "Instagram":
          window
            .open(
              "https://www.instagram.com/explore/tags/" + encodedData,
              "_blank"
            )
            ?.focus();
          break;
      }
    }, 0);
  } else if (userAgent.match(/android|Android/i)) {
    setTimeout(function () {
      switch (searchEngine) {
        case "Naver":
          window.location.href =
            "intent://inappbrowser?url=https%3A%2F%2Fm.search.naver.com%2Fsearch.naver%3Fquery%3D" +
            encodedData +
            "&target=new&version=6#Intent;scheme=naversearchapp;action=android.intent.action.VIEW;category=android.intent.category.BROWSABLE;package=com.nhn.android.search;end";
          break;

        case "Instagram":
          window
            .open(
              "https://www.instagram.com/explore/tags/" + encodedData,
              "_blank"
            )
            ?.focus();
          break;
      }
    }, 0);
  } else {
    window.confirm("모바일 웹만 지원하는 서비스입니다.");
  }
  return;
};

export default WebSearch;
