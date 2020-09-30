import React from "react";
import styled from "styled-components";
import "./index.css";

const CafePreviewBox = styled.div`
  cursor: pointer;
  text-align: center;
`;

type CafePreviewImagProps = {
  cafeName: string | undefined;
  cafeImg: string | undefined;
};

const CafePreviewImg = ({ cafeName, cafeImg }: CafePreviewImagProps) => {
  return (
    <CafePreviewBox>
      <div className="cafe-preview-img">
        <img src={"https://" + cafeImg} alt="cafe" />
      </div>
      <div className="cafe-preview-name">{cafeName}</div>
    </CafePreviewBox>
  );
};

export default CafePreviewImg;
