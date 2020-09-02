import React from "react";
import { CafeInfo } from "../Cafe";
import SlideOne from "../SlideOne";
import ImageCarousel from "../ImageCarousel";

type CafeImageSlideProps = {
  cafe: CafeInfo | null;
};
let cafeImageUris: string[] | undefined = [];

const CafeImageSlide = ({ cafe }: CafeImageSlideProps) => {
  cafeImageUris = cafe?.imageUris;

  return (
    <div>
      <ImageCarousel>
        {cafeImageUris?.map((uri) => {
          return <SlideOne imageUri={"http://" + uri} key={uri} />;
        })}
      </ImageCarousel>
    </div>
  );
};

export default CafeImageSlide;
