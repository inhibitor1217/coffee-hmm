import React from "react";
import ImageCarousel from "../ImageCarousel";
import { CafeInfo } from "../../../utils";
import ImageSlideBig from "../ImageSlideBig";

type CafeImageSlideProps = {
  cafe: CafeInfo | null;
};
let cafeImageUris: string[] | undefined = [];

const cafeDefaultImage = "/images/coffee-hmm-512x512.png";

const CafeImageSlide = ({ cafe }: CafeImageSlideProps) => {
  cafeImageUris = cafe?.imageUris;

  if (cafeImageUris === undefined) {
    return <ImageSlideBig imageUri={cafeDefaultImage} />;
  } else {
    return (
      <div>
        <ImageCarousel>
          {cafeImageUris?.map((uri) => {
            return <ImageSlideBig imageUri={"https://" + uri} key={uri} />;
          })}
        </ImageCarousel>
      </div>
    );
  }
};

export default CafeImageSlide;
