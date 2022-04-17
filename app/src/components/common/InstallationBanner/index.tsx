import React from "react";
import styled from "styled-components";

import openApplicationStore from "utils/ openApplicationStore";
import { getSessionStorage, setSessionStorage } from "utils/sessionStorage";

import {
  appInstallGuideBanner,
  SessionStorage,
} from "constants/common/webStorage";

import Banner from "../Banner";
import Icon from "../Icon";

const InstallationBanner = () => {
  const isHidden = getSessionStorage(SessionStorage.appInstallGuideBanner);

  if (isHidden) return null;

  function closeInstallBanner() {
    setSessionStorage(
      SessionStorage.appInstallGuideBanner,
      appInstallGuideBanner.true,
    );
  }

  return (
    <Banner onClose={closeInstallBanner}>
      <Logo>
        <Icon src="/icons/logo.png" size={48} />
      </Logo>
      <TextWrapper>
        <Title>커피흠</Title>
        <Subtitle>서울 곳곳의 감성 카페를 소개합니다.</Subtitle>
      </TextWrapper>
      <TextButton
        onTouchStart={openApplicationStore}
        onTouchEnd={(e) => e.preventDefault()}
      >
        다운
      </TextButton>
    </Banner>
  );
};

const Logo = styled.div`
  overflow: hidden;
  border-radius: 8px;
  border: 1px solid rgba(240, 240, 240, 1);
  margin-right: 8px;
`;
const TextWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;
const Title = styled.h1`
  font-size: 14px;
  font-weight: 700;
`;
const Subtitle = styled.p`
  font-size: 12px;
  margin: 4px 0 0;
`;
const TextButton = styled.button`
  padding: 6px 12px;
  background-color: rgba(40, 110, 240, 1);
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.25);
  color: white;
  border-radius: 14px;
  margin: 0 10px 0 auto;
`;

export default InstallationBanner;
