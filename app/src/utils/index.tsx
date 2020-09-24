import styled from "styled-components";
import { isMobile, isAndroid, isIOS } from "react-device-detect";

export const cafeApiURL =
  "https://ird14dr4ze.execute-api.ap-northeast-2.amazonaws.com/production/cafe";

export type Menus = {
  categories: MenuCategory[] | null;
};

export type MenuCategory = {
  categoryName: string;
  categoryMenu: MenuPrice[];
};

export type MenuPrice = {
  name: string;
  ename: string;
  price: string;
};

export type PlaceInfo = {
  placeCategory: string;
  cafes: CafeInfo[];
};

export type CafeInfo = {
  id: string;
  name: string;
  place: string;
  imageUris: string[];
  mainImageUri: string;
  americanoPrice: number;
  floor: number;
  menus: Menus;
};

export const HomeScale = styled.div`
  width: 100vw;
  height: 100vh;
`;

export const DetailContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`;

export const ImageWrapper = styled.div`
  width: 360px;
  margin: auto;
  box-shadow: 0px 1px 9px 1px rgba(199, 198, 198, 0.75);
  position: relative;
`;

export const IconWrapper = styled.div`
  width: 360px;
  margin: auto;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
`;

export const CafeInfoWrapper = styled.div`
  width: 320px;
  margin: 0 auto;
  padding-bottom: 14px;
  display: flex;
  align-items: stretch;
  flex-direction: column;
`;

export const InfoRow = styled.div`
  display: flex;
  padding-bottom: 8px;
`;

export const MenuContainer = styled.div`
  width: 320px;
  min-height: 180px;
  overflow: hidden;
  padding-bottom: 14px;
  position: relative;
`;

export const PopupWrapper = styled.div`
  display: flex;
  align-items: stretch;
  justify-content: center;
  flex-direction: column;
`;

export const copyLink = (cafeName: string | undefined) => {
  window.confirm(cafeName + "\nHmm link copied!");
};

export const openSearch = (searchedData: string, searchEngine: string) => {
  const encodedData = encodeURIComponent(searchedData);

  if (isMobile) {
    if (isIOS) {
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
    } else if (isAndroid) {
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
    }
  } else {
    window.confirm("모바일 웹만 지원하는 서비스입니다.");
  }
  return;
};
