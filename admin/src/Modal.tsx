import React, { useContext, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import styled from 'styled-components';
import { ModalContext } from './context';

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

const Modal: React.FC = ({children}) => {
  const [width, setWidth] = useState<number | null>(null);
  const modalSizeRef = useRef<HTMLDivElement>(null);
  const {isModalOpen} = useContext(ModalContext);

  const updateWidth = () => {
    if(modalSizeRef.current){
      setWidth(modalSizeRef.current.clientWidth);
    }
  }

  useEffect(() => {
    updateWidth();
  }, [])

  useEffect(() => {
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, [])

  return createPortal(
    <div ref={modalSizeRef}>
      {width && 
        <ModalWrapper style={{transform: isModalOpen? `translate(${width - 480}px, 0px)` : `translate(${width + 480}px,0)`}}>
          <div>{children}</div>
        </ModalWrapper>
      }
    </div>,
    document.body
  );
}

export default Modal;