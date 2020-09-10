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
        <button onClick={() => openNaverApp(searchedData)}>
          <img
            src="/images/logo/naver_bi.png"
            alt="naver"
            style={{ width: "56px", height: "12px" }}
          />
        </button>
        <button>
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

export const openNaverApp = (searchedData: string) => {
  const encodedData = encodeURIComponent(searchedData);
  const userAgent = navigator.userAgent;

  if (userAgent.match(/iPhone|iPad|iPod/i)) {
    var clickedAt = +new Date();

    setTimeout(function () {
      if (+new Date() - clickedAt < 1000) {
        if (
          window.confirm(
            "네이버 앱 최신 버전이 설치되어 있지 않습니다.\n설치페이지로 이동하시겠습니까?"
          )
        ) {
          window.location.href =
            "http://itunes.apple.com/kr/app/id393499958?mt=8";
        }
      }
    }, 1500);

    setTimeout(function () {
      window.location.href =
        "naversearchapp://inappbrowser?url=http%3A%2F%2Fm.naver.com&target=new&version=6";
    }, 0);
  } else if (userAgent.match(/android|Android/i)) {
    setTimeout(function () {
      window.location.href =
        "intent://inappbrowser?url=https%3A%2F%2Fm.search.naver.com%2Fsearch.naver%3Fquery%3D" +
        encodedData +
        "&target=new&version=6#Intent;scheme=naversearchapp;action=android.intent.action.VIEW;category=android.intent.category.BROWSABLE;package=com.nhn.android.search;end";
    }, 0);
  } else {
    window.confirm("모바일 웹만 지원하는 서비스입니다.");
  }
  return;
};

export default WebSearch;
