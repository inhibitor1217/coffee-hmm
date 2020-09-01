import React from "react";
import SlideOne from "../SlideOne";
import ImageCarousel from "../ImageCarousel";
import { CafeInfo } from "../MainFeed";

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
            return <SlideOne imageUri={"http://" + uri} key={uri} />;
          })}
        </ImageCarousel>
      </div>
    );
  }
};

export default CafeImageSlide;
