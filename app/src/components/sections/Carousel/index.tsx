import React, { useState } from "react";
import styled, { css } from "styled-components";
import "./index.css";

const ScrouselWrapper = styled.div`
  display: flex;
`;

interface ICarouselSlide {
  active?: boolean;
}

const SCarouselSlide = styled.div<ICarouselSlide>`
  flex: 0 0 auto;
  opacity: ${(props) => (props.active ? 1 : 0)};
  transition: all 1s ease;
  widht: 100%;
`;

interface ICarouselProps {
  currentSlide: number;
}

const SCarouselSlides = styled.div<ICarouselProps>`
  display: flex;
  ${(props) =>
    props.currentSlide &&
    css`
      transform: translateX(-${props.currentSlide * 360}px);
    `};
  transition: all 1s ease;
`;

interface IProps {
  children: JSX.Element[] | undefined;
}

const Carousel = ({ children }: IProps) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  let activeSlide = children?.map((slide, index) => (
    <SCarouselSlide active={currentSlide === index} key={index}>
      {slide}
    </SCarouselSlide>
  ));

  function slideLeft() {
    setCurrentSlide(
      (currentSlide - 1 + (activeSlide || []).length) %
        (activeSlide || []).length
    );
  }
  function slideRight() {
    setCurrentSlide((currentSlide + 1) % (activeSlide || []).length);
  }

  return (
    <div>
      <ScrouselWrapper>
        <SCarouselSlides currentSlide={currentSlide}>
          {activeSlide}
        </SCarouselSlides>
      </ScrouselWrapper>

      <button
        className="slide-button slide-button-left"
        onTouchStart={slideLeft}
      />
      <button
        className="slide-button slide-button-right"
        onTouchStart={slideRight}
      />
    </div>
  );
};

export default Carousel;
