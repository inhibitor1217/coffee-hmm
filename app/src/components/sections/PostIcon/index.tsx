import React from "react";
import styled from "styled-components";
import "./index.css";

const IconsContainer = styled.div`
  width: 360px;
  height: 40px;
`;

const PostIcon = () => {
  return (
    <IconsContainer>
      <span className="material-icons favorite-icon">favorite_border</span>
      <span className="material-icons chat-icon">chat_bubble_outline</span>
    </IconsContainer>
  );
};

export default PostIcon;
