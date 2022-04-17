import React, { PropsWithChildren, ReactNode } from "react";
import styled from "styled-components";

import usePopup from "hooks/common/usePopup";

import closeIcon from "./images/baseline_close_black_24dp.png";
import Icon from "../Icon";

interface Props {
  additionalClose?: ReactNode;
  onClose?: () => void;
}

const Popup = ({
  additionalClose,
  onClose,
  children,
}: PropsWithChildren<Props>) => {
  const { contentRef, isClosed, closePopup } = usePopup({ onClose });

  return isClosed ? null : (
    <Container>
      <ContentBox ref={contentRef}>
        <CloseIconButton
          onTouchStart={closePopup}
          onTouchEnd={(e) => e.preventDefault()}
        >
          <Icon src={closeIcon} size={18} />
        </CloseIconButton>
        {children}
        <CloseButton
          onTouchEnd={(e) => {
            closePopup();
            e.preventDefault();
          }}
        >
          {additionalClose}
        </CloseButton>
      </ContentBox>
    </Container>
  );
};

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;
const Container = styled(Wrapper)`
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  z-index: 1000;
`;
const ContentBox = styled(Wrapper)`
  position: relative;
  flex-direction: column;
  width: 80%;
  padding: 40px 0;
  border-radius: 24px;
  background: white;
  box-shadow: 0 4px 4px rgba(0, 0, 0, 0.25);
  text-align: center;
`;
const CloseButton = styled.button``;
const CloseIconButton = styled(CloseButton)`
  position: absolute;
  top: 20px;
  right: 20px;
`;

export default Popup;
