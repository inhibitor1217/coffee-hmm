import React from "react";
import styled from "styled-components";

const SContainer = styled.div`
  align-items: center;
  display: flex;
  active?: boolean;
`;

type SlideOneProps = {
  imageUri: string;
};

const SlideOne = ({ imageUri }: SlideOneProps) => {
  return (
    <SContainer>
      <img
        src={imageUri}
        alt="cafe"
        style={{
          width: "360px",
          height: "360px",
        }}
      />
    </SContainer>
  );
};

export default SlideOne;
