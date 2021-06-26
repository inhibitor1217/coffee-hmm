import React, { useState } from "react";

import { onImageLoad } from "utils";
import { StyledSpinnerContainer } from "utils/styled";

import Spinner from "components/common/Spinner";

import "./index.css";

type CarouselDetailImageProps = {
  image: string;
};

const CarouselDetailImage = ({ image }: CarouselDetailImageProps) => {
  const [isImageReady, setIsImageReady] = useState<boolean>(false);

  return (
    <div className="detail-carousel-img">
      <img
        src={image}
        alt="img"
        style={{ display: isImageReady ? "initial" : "none" }}
        onLoad={() => onImageLoad(setIsImageReady)}
      />
      <StyledSpinnerContainer
        visible={!isImageReady}
        size={document.body.clientWidth}
      >
        <Spinner size={24} />
      </StyledSpinnerContainer>
    </div>
  );
};

export default CarouselDetailImage;
