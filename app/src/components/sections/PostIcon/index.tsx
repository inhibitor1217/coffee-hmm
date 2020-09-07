import React from "react";
import styled from "styled-components";
import "./index.css";
import MaterialIcon from "../../common/MaterialIcon";

const IconsContainer = styled.div`
  width: 360px;
  height: 40px;
`;

const PostIcon = () => {
  return (
    <IconsContainer>
      <span className="favorite">
        <MaterialIcon
          icon="favorite_border"
          size={24}
          color="rgba(0, 0, 0, 0.56)"
        />
      </span>
      <span className="chat">
        <MaterialIcon
          icon="chat_bubble_outline"
          size={24}
          color="rgba(0, 0, 0, 0.56)"
        />
      </span>
    </IconsContainer>
  );
};

export default PostIcon;
