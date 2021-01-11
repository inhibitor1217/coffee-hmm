import React from 'react';
import { createPortal } from 'react-dom';
import styled from 'styled-components';

const XPos = window.innerWidth;

const ModalWrapper = styled.div`
  position: absolute;
  top: 0;
  transition: all 1s ease;

  width: 480px;
  height: 100%;
  overflow: hidden;
  background: #ffffff;
  outline: 1px solid #d2d2d2;
`;

type ModalProps = {
  isModalOpen: boolean;
}

const Modal: React.FC<ModalProps> = ({isModalOpen, children}) => {
  return createPortal(
    <ModalWrapper style={{transform: isModalOpen? `translate(${XPos - 480}px, 0px)` : `translate(${XPos + 480}px,0)`}}>
      <div>{children}</div>
    </ModalWrapper>,
    document.body
  );
}

export default Modal;