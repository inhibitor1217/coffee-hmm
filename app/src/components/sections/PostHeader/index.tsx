import React from "react";
import styled from "styled-components";
import "./index.css";
import { Link } from "react-router-dom";

const HeaderWrapper = styled.div`
  height: 54px;
  position: relative;
`;

type PostHeaderProps = {
  cafeId: string | undefined;
  cafeName: string | undefined;
};

const PostHeader = ({ cafeId, cafeName }: PostHeaderProps) => {
  return (
    <HeaderWrapper>
      <div className="cafe-header-icon-box">
        <span className="cafe-header-icon">
          <img
            src="/images/coffee-hmm-192x192.png"
            alt={cafeName}
            width="32px"
            height="32px"
          />
        </span>
      </div>
      <Link to={`/cafe/${cafeId}`}>
        <div className="cafe-header-name">{cafeName}</div>
      </Link>
      <span className="material-icons cafe-header-menu">more_horiz</span>
    </HeaderWrapper>
  );
};

export default PostHeader;
