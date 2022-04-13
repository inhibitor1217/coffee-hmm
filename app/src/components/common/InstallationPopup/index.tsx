import React, { useEffect, useRef } from "react";
import styled from "styled-components";
import lottie from "lottie-web";

import openApplicationStore from "utils/ openApplicationStore";
import { getSessionStorage, setSessionStorage } from "utils/sessionStorage";
import {
  appInstallGuidePopup,
  SessionStorage,
} from "constants/common/webStorage";

import starIcon from "./images/star.json";
import downloadIcon from "./images/baseline_download_white_24dp.png";
import Popup from "../Popup";
import Icon from "../Icon";

const InstallationPopup = () => {
  const isHidden = getSessionStorage(SessionStorage.appInstallGuidePopup);

  if (isHidden) return null;

  const lottieRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (lottieRef.current) {
      lottie.loadAnimation({
        container: lottieRef.current,
        renderer: "svg",
        animationData: starIcon,
      });
    }
  }, []);

  function closeInstallPopup() {
    setSessionStorage(
      SessionStorage.appInstallGuidePopup,
      appInstallGuidePopup.true,
    );
  }

  return (
    <Popup
      onClose={closeInstallPopup}
      additionalClose={
        <Helper onClick={closeInstallPopup}>
          괜찮아요. 모바일웹으로 볼게요.
        </Helper>
      }
    >
      <Lottie ref={lottieRef} />
      <Title>
        커피흠 앱에서 카페 피드, 위치, 메뉴
        <br />더 다양한 정보를 확인하세요 !
      </Title>
      <Subtitle>
        커피흠 앱은 별도의 가입과 로그인 없이
        <br />
        이용할 수 있는 서비스입니다
      </Subtitle>
      <InstallButton
        onTouchStart={openApplicationStore}
        onTouchEnd={(e) => e.preventDefault()}
      >
        커피흠 앱 다운로드
        <Icon src={downloadIcon} size={18} />
      </InstallButton>
    </Popup>
  );
};

const Helper = styled.div`
  font-size: 12px;
  color: rgba(166, 166, 166, 1);
`;
const Lottie = styled.div`
  width: 120px;
  height: 120px;
`;
const Title = styled.h1`
  font-size: 18px;
`;
const Subtitle = styled.p`
  font-size: 12px;
  margin: 20px 0;
`;
const InstallButton = styled.button`
  display: flex;
  background-color: rgba(40, 110, 240, 1);
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.25);
  border-radius: 20px;
  padding: 12px 36px;
  margin-bottom: 16px;
  color: white;
  font-size: 12px;
`;

export default InstallationPopup;
