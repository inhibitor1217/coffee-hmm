import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";

const SquareContainer = styled.span``;

type SquareArrangeProps = {
  cafeId: string;
  cafeImg: string;
};

const SquareArrange = ({ cafeId, cafeImg }: SquareArrangeProps) => {
  return (
    <SquareContainer>
      <Link to={`/cafe/${cafeId}`}>
        <img
          src={"https://" + cafeImg}
          alt="cafe"
          style={{
            width: "116px",
            height: "116px",
          }}
        />
      </Link>
    </SquareContainer>
  );
};

export default SquareArrange;
