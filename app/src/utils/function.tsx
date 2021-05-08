import { isMobile, isAndroid, isIOS } from 'react-device-detect';
import { DOWN, initialCarouselState, LEFT, RIGHT, UP } from './constant';

export const onImageLoad = (setReady: (type: boolean) => void) => {
  setReady(true);
};

export const openSearch = (searchedData: string, searchEngine: string) => {
  const encodedData = encodeURIComponent(searchedData);

  if (isMobile) {
    if (isIOS) {
      setTimeout(function () {
        switch (searchEngine) {
          case 'Naver':
            window
              .open(
                'https://m.search.naver.com/search.naver?query=' + encodedData,
                '_blank',
              )
              ?.focus();
            break;

          case 'Instagram':
            window
              .open(
                'https://www.instagram.com/explore/tags/' + encodedData,
                '_blank',
              )
              ?.focus();
            break;
        }
      }, 0);
    } else if (isAndroid) {
      setTimeout(function () {
        switch (searchEngine) {
          case 'Naver':
            window.location.href =
              'intent://inappbrowser?url=https%3A%2F%2Fm.search.naver.com%2Fsearch.naver%3Fquery%3D' +
              encodedData +
              '&target=new&version=6#Intent;scheme=naversearchapp;action=android.intent.action.VIEW;category=android.intent.category.BROWSABLE;package=com.nhn.android.search;end';
            break;

          case 'Instagram':
            window
              .open(
                'https://www.instagram.com/explore/tags/' + encodedData,
                '_blank',
              )
              ?.focus();
            break;
        }
      }, 0);
    }
  } else {
    window.confirm('모바일 웹만 지원하는 서비스입니다.');
  }
  return;
};

export const copyLink = (cafeName: string | undefined) => {
  window.confirm(cafeName + '\n흠 링크가 복사되었습니다.');
};

export const reducerCarousel = (state: any, action: any) => {
  switch (action.type) {
    case 'reset':
      return initialCarouselState;
    case DOWN:
      return {
        ...state,
        dir: DOWN,
        sliding: true,
        pos: state.pos === 0 ? action.numItems - 1 : state.pos - 1,
      };
    case UP:
      return {
        ...state,
        dir: UP,
        sliding: true,
        pos: state.pos === action.numItems - 1 ? 0 : state.pos + 1,
      };
    case RIGHT:
      return {
        ...state,
        dir: RIGHT,
        sliding: true,
        pos: state.pos === 0 ? action.numItems - 1 : state.pos - 1,
      };
    case LEFT:
      return {
        ...state,
        dir: LEFT,
        sliding: true,
        pos: state.pos === action.numItems - 1 ? 0 : state.pos + 1,
      };
    case 'stopSliding':
      return {
        ...state,
        sliding: false,
      };
    default:
      return state;
  }
};

export const getOrder = (index: number, pos: number, numItems: number) => {
  return index - pos < 0 ? numItems - Math.abs(index - pos) : index - pos;
};

export enum AppStage {
  development = 'development',
  production = 'production',
  test = 'test',
}

export function appStage(): AppStage {
  const appStage = process.env.NODE_ENV as AppStage;
  return appStage;
}
