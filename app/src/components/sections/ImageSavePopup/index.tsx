import React from "react";
import styled from "styled-components";
import CafeImageSlide from "../CafeImageSlide";
import "./index.css";
import { ImageWrapper, CafeInfo } from "../../../utils";

const SaveContainer = styled.div`
  display: flex;
  align-items: stretch;
  justify-content: center;
  flex-direction: column;
`;

type ImageSavePopupProps = {
  cafe: CafeInfo | null;
};

const ImageSavePopup = ({ cafe }: ImageSavePopupProps) => {
  return (
    <SaveContainer>
      <div className="save-header">hmm</div>
      <ImageWrapper>
        <CafeImageSlide cafe={cafe} />
      </ImageWrapper>
      <div className="save-text">
        @{cafe?.name}
        <br />#{cafe?.place}카페&nbsp;#OPEN&nbsp;#9:00&nbsp;#CLOSE&nbsp;#19:00
      </div>
      <div className="save-button">
        <button>화면 저장</button>
      </div>
    </SaveContainer>
  );
};

export default ImageSavePopup;
