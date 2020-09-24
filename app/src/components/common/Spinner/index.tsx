import React from "react";
import styled, { keyframes } from "styled-components";

interface SpinnerProps {
  size: number;
  inverted?: boolean;
}

const spinnerKeyframes = keyframes`
0% {
  transform: rotate(0deg);
}
100% {
  transform: rotate(360deg);
}
`;

const StyledSpinner = styled.div<Partial<SpinnerProps>>`
  border-radius: 50%;
  width: ${(props) => props.size}px;
  height: ${(props) => props.size}px;
  &:after {
    border-radius: 50%;
    width: ${(props) => props.size}px;
    height: ${(props) => props.size}px;
  }
  border: ${(props) => props.size! / 8}px solid
    ${(props) => (props.inverted ? "#ffffff" : "#55AEF3")};
  border-left: ${(props) => props.size! / 8}px solid
    ${(props) => (props.inverted ? "#ffffff" : "#fafafa")};
  animation: ${spinnerKeyframes} 1.1s infinite linear;
`;

const defaultProps: Partial<SpinnerProps> = {
  size: 64,
};

const Spinner = (props: SpinnerProps) => {
  return <StyledSpinner size={props.size / 2} />;
};

Spinner.defaultProps = defaultProps;

export default Spinner;
