import React, { useState, useEffect } from "react";
import styled from "styled-components";
import PostContents from "../PostContents";
import { CafeInfo } from "../MainFeed";
import { cafeApiURL } from "../../pages/Main";

const ArticleContainer = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  overflow: hidden;
`;

type PostProps = {
  cafeId: string;
};

const Post = ({ cafeId }: PostProps) => {
  const [cafeDetails, setCafeDetails] = useState<CafeInfo | null>(null);

  useEffect(() => {
    async function fetchData() {
      await fetch(cafeApiURL + `/${cafeId}`)
        .then((response) => response.json())
        .then((jsonStr) => setCafeDetails(jsonStr.Item))
        .catch((error) => console.log("Error: ", error));
    }
    fetchData();
  }, [cafeId]);

  return (
    <ArticleContainer>
      <PostContents cafe={cafeDetails} />
    </ArticleContainer>
  );
};

export default Post;
