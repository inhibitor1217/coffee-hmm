import React from "react";
import { CafeInfo } from "../Cafe";
import SlideOne from "../SlideOne";
import Carousel from "../Carousel";

type CafeImageSlideProps = {
  cafe: CafeInfo | null;
};
let cafeImageUris: string[] | undefined = [];

const CafeImageSlide = ({ cafe }: CafeImageSlideProps) => {
  cafeImageUris = cafe?.imageUris;

  return (
    <div>
      <Carousel>
        {cafeImageUris?.map((uri) => {
          return <SlideOne imageUri={"http://" + uri} key={uri} />;
        })}
      </Carousel>
    </div>
  );
};

export default CafeImageSlide;
