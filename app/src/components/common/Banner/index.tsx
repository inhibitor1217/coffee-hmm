import React, { PropsWithChildren } from "react";
import styled from "styled-components";

import useBanner from "hooks/common/useBanner";

import closeIcon from "./images/baseline_close_black_24dp.png";
import Icon from "../Icon";

interface Props {
  onClose?: () => void;
}

const Banner = ({ onClose, children }: PropsWithChildren<Props>) => {
  const { isClosed, closeBanner } = useBanner({ onClose });

  return (
    <Container isClosed={isClosed}>
      <CloseButton
        onTouchStart={closeBanner}
        onTouchEnd={(e) => {
          e.preventDefault();
        }}
      >
        <Icon src={closeIcon} size={18} />
      </CloseButton>
      {children}
    </Container>
  );
};

const Container = styled.div<{ isClosed: boolean }>`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  align-items: center;
  padding: 20px 10px;
  border: 1px solid rgba(166, 166, 166, 0.2);
  transform: translateY(${({ isClosed }) => (isClosed ? "100%" : "0")});
  transition: transform 200ms ease-in-out;
  z-index: 900;
`;

const CloseButton = styled.button`
  margin-right: 8px;
`;

export default Banner;
