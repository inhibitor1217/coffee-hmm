import React, { useEffect, useState } from "react";
import MainFeed from "../../sections/MainFeed";
import { CafeInfo, HomeScale, cafeApiURL } from "../../../utils";

const MainPage = () => {
  const [cafeApi, setCafeApi] = useState<CafeInfo[] | null>(null);

  useEffect(() => {
    async function fetchData() {
      await fetch(cafeApiURL)
        .then((response) => response.json())
        .then((jsonData) => JSON.stringify(jsonData))
        .then((jsonStr) => setCafeApi(JSON.parse(jsonStr)))
        .catch((error) => console.log("Error: ", error));
    }
    fetchData();
  }, []);

  return (
    <HomeScale>
      <MainFeed cafeList={cafeApi} />
    </HomeScale>
  );
};

export default MainPage;
