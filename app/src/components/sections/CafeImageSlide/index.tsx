import React from "react";
import SlideOne from "../ImageSlideOne";
import ImageCarousel from "../ImageCarousel";
import { CafeInfo } from "../../../utils";

type CafeImageSlideProps = {
  cafe: CafeInfo | null;
};
let cafeImageUris: string[] | undefined = [];

const cafeDefaultImage = "/images/coffee-hmm-512x512.png";

const CafeImageSlide = ({ cafe }: CafeImageSlideProps) => {
  cafeImageUris = cafe?.imageUris;

  if (cafeImageUris === undefined) {
    return <SlideOne imageUri={cafeDefaultImage} />;
  } else {
    return (
      <div>
        <ImageCarousel>
          {cafeImageUris?.map((uri) => {
            return <SlideOne imageUri={"https://" + uri} key={uri} />;
          })}
        </ImageCarousel>
      </div>
    );
  }
};

export default CafeImageSlide;
