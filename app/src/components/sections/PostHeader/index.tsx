import React from "react";
import styled from "styled-components";
import "./index.css";

const HeaderWrapper = styled.div`
  height: 54px;
  position: relative;
`;

type PostHeaderProps = {
  cafeName: string | undefined;
};

const PostHeader = ({ cafeName }: PostHeaderProps) => {
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
      <div className="cafe-header-name">{cafeName}</div>
      <span className="material-icons cafe-header-menu">more_horiz</span>
    </HeaderWrapper>
  );
};

export default PostHeader;
