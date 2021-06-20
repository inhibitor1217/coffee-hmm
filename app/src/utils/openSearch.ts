import { isAndroid, isIOS, isMobile } from "react-device-detect";

export function openSearch(searchedData: string, searchEngine: string) {
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
}
