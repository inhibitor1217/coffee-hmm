import { isMobile, isAndroid, isIOS } from "react-device-detect";
import { DOWN, initialCarouselState, LEFT, RIGHT, UP } from "./constant";

export const letterValidation = (data: string) => {
    let Korean = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/;
    let English = /[a-zA-Z]/;
 
    if(!Korean.test(data) && !English.test(data)){
        return false;
    }
    return true;
}

export const onImageLoad = (setReady:(type: boolean) => void) => {
    setReady(true);
};

export const slidePosition = (index: number, currentIndex: number, currentPos: number, topPos: number, bottomPos: number) => {
    const CURRENT = currentPos;
    const TOP = topPos;
    const BOTTOM = bottomPos;
    const MOST_TOP = TOP*2;
    const MOST_BOTTOM = BOTTOM*2;
    const currentCafeIndex = currentIndex;

    if(currentCafeIndex > 0){
        if(index === currentCafeIndex){
            return `${CURRENT}px`;
        }else if(index === currentCafeIndex - 1){
            return `${TOP}px`;
        }else if(index === currentCafeIndex + 1){
            return `${BOTTOM}px`;
        }else { // out of current displayed 3
            if(index < currentCafeIndex){
                return `${MOST_TOP}px`;
            }else{
                return `${MOST_BOTTOM}px`;
            }
        }
    }else{
        if(index === 0){
            return `${CURRENT}px`;
        }
        else if(index === 1){
            return `${BOTTOM}px`;
        }
        return `${MOST_BOTTOM}px`; // out of initail displayed 2
    }        
}

export const moveUpOrLeft = (current: number, setIndex:(index: number)=>void) => {
    if(current > 0){
        setIndex(current - 1);
    }
}

export const moveDownOrRight = (current: number, setIndex:(index: number)=>void, totalLength: number) => {
    if(current < totalLength){
        setIndex(current + 1);
    }
}

export const slideImageSize = (index: number, current: number) => {
  if (index === current){
    return true;
  }else{
    return false;
  }
}

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
  
export const copyLink = (cafeName: string | undefined) => {
    window.confirm(cafeName + "\n흠 링크가 복사되었습니다.");
};

export const reducerCarousel = (state: any, {type, numItems}: any) => {
  switch(type){
      case "reset":
          return initialCarouselState;

      case DOWN:
          return {
              ...state,
              dir: DOWN,
              sliding: true,
              pos: state.pos === 0? numItems - 1 : state.pos - 1
          }
      case UP:
          return {
              ...state,
              dir: UP,
              sliding: true,
              pos: state.pos === numItems - 1? 0 : state.pos + 1
          }
      case RIGHT:
          return {
              ...state,
              dir: RIGHT,
              sliding: true,
              pos: state.pos === 0? numItems - 1 : state.pos -1
          }
      case LEFT:
          return {
              ...state,
              dir: LEFT,
              sliding: true,
              pos: state.pos === numItems - 1? 0 : state.pos + 1
          }
      case "stopSliding":
          return {
              ...state,
              sliding: false
          }
      default:
          return state;
  }
}

export const getOrder = (index: number, pos: number, numItems:number) => {
  return (index - pos < 0 ? numItems - Math.abs(index - pos) : index - pos);
}