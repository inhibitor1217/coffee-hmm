import React, { useState } from "react";
import styled, { css } from "styled-components";
import "./index.css";

const MCarouselWrapper = styled.div`
  display: flex;
`;

interface MCarouselSlide {
  active?: boolean;
}

const MCarouselSlide = styled.div<MCarouselSlide>`
  flex: 0 0 auto;
  transition: all 1s ease;
  widht: 100%;
`;

interface MCarouselProps {
  currentSlide: number;
}

const MCarouselSlides = styled.div<MCarouselProps>`
  display: flex;
  ${(props) =>
    props.currentSlide &&
    css`
      transform: translateX(-${props.currentSlide * 320}px);
    `};
  transition: all 1s ease;
`;

interface IProps {
  children: JSX.Element[] | undefined;
  totalSubCategory: number;
}

const MenuCarousel = ({ children, totalSubCategory }: IProps) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  let activeSlide = children?.map((slide, index) => (
    <MCarouselSlide active={currentSlide === index} key={index}>
      {slide}
    </MCarouselSlide>
  ));

  const subInOneSlide = 2;

  function MslideLeft() {
    setCurrentSlide(
      (currentSlide - 1 + totalSubCategory) % (totalSubCategory / subInOneSlide)
    );
  }
  function MslideRight() {
    setCurrentSlide((currentSlide + 1) % (totalSubCategory / subInOneSlide));
  }

  return (
    <div>
      <MCarouselWrapper>
        <MCarouselSlides currentSlide={currentSlide}>
          {activeSlide}
        </MCarouselSlides>
      </MCarouselWrapper>

      <button
        className="Mslide-button Mslide-button-left"
        onTouchStart={MslideLeft}
      />
      <button
        className="Mslide-button Mslide-button-right"
        onTouchStart={MslideRight}
      />
    </div>
  );
};

export default MenuCarousel;
