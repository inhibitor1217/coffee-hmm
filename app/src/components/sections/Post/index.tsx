import React, { useState, useEffect } from "react";
import PostContents from "../PostContents";
import { CafeInfo } from "../MainFeed";
import { cafeApiURL } from "../../pages/Main";

type PostProps = {
  cafeId: string | undefined;
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
    <div>
      <PostContents cafe={cafeDetails} />
    </div>
  );
};

export default Post;
