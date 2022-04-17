import React from "react";
import styled from "styled-components";

interface Props {
  src: string;
  size: number;
  alt?: string;
}

const Icon = ({ src, size, alt }: Props) => {
  return <Image src={src} size={size} alt={alt} />;
};

const Image = styled.img<{ size: number }>`
  width: ${(props) => props.size}px;
  height: ${(props) => props.size}px;
`;

export default Icon;
