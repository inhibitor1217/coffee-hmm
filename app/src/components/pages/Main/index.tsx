import React, { useEffect, useState } from "react";
import MainFeed, { CafeInfo } from "../../sections/MainFeed";
import styled from "styled-components";

export const HomeScale = styled.div`
  width: 100vw;
  height: 90vh;
  background-color: rgba(var(--b3f, 250, 250, 250), 1);
`;

export const cafeApiURL =
  "https://ird14dr4ze.execute-api.ap-northeast-2.amazonaws.com/production/cafe";

const MainPage = () => {
  const [cafeApi, setCafeApi] = useState<CafeInfo[] | null>(null);

  useEffect(() => {
    async function fetchData() {
      await fetch(cafeApiURL)
        .then((response) => response.json())
        .then((jsonData) => JSON.stringify(jsonData))
        .then((jsonStr) => setCafeApi(JSON.parse(jsonStr).Items))
        .catch((error) => console.log("Error: ", error));
    }
    fetchData();
  }, []);

  return (
    <HomeScale>
      <MainFeed mainCafeList={cafeApi} />
    </HomeScale>
  );
};

export default MainPage;
