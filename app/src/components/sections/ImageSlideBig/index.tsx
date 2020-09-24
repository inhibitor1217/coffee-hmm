import React, { useState } from "react";
import styled from "styled-components";
import Spinner from "../../common/Spinner";

const SContainer = styled.div`
  align-items: center;
  display: flex;
  active?: boolean;
`;

const SpinnerContainer = styled.div<{ visible: boolean }>`
  justify-content: center;
  align-items: center;
  width: 360px;
  height: 360px;
  display: none;
  ${(props) => props.visible && "display: flex;"}
`;

type ImageSlideBigProps = {
  imageUri: string;
};

const ImageSlideBig = ({ imageUri }: ImageSlideBigProps) => {
  const [isImageReady, setIsImageReady] = useState<boolean>(false);

  const onImageLoad = () => {
    setIsImageReady(true);
  };

  return (
    <SContainer>
      <img
        src={imageUri}
        alt="cafe"
        style={{
          width: "360px",
          height: "360px",
          display: isImageReady ? "initial" : "none",
        }}
        onLoad={onImageLoad}
      />
      <SpinnerContainer visible={!isImageReady}>
        <Spinner />
      </SpinnerContainer>
    </SContainer>
  );
};

export default ImageSlideBig;
