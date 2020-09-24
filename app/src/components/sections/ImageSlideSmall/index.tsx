import React, { useState } from "react";
import styled from "styled-components";
import Spinner from "../../common/Spinner";
import "./index.css";

const SmallSpinnerContainer = styled.div<{ visible: boolean }>`
  justify-content: center;
  align-items: center;
  width: 90px;
  height: 90px;
  display: none;
  ${(props) => props.visible && "display: flex;"}
`;

type ImageSlideSmallProps = {
  imageUri: string;
};

const ImageSlideSmall = ({ imageUri }: ImageSlideSmallProps) => {
  const [isImageReady, setIsImageReady] = useState<boolean>(false);

  const onImageLoad = () => {
    setIsImageReady(true);
  };

  return (
    <div className="image-slide-small">
      <img
        src={imageUri}
        alt="cafe"
        style={{
          width: "90px",
          height: "81px",
          backgroundSize: "none",
          display: isImageReady ? "initial" : "none",
        }}
        onLoad={onImageLoad}
      />
      <SmallSpinnerContainer visible={!isImageReady}>
        <Spinner />
      </SmallSpinnerContainer>
    </div>
  );
};

export default ImageSlideSmall;
