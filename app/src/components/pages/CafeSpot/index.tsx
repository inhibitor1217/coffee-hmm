import React, { useState, useEffect } from "react";
import { CafeInfo } from "../../sections/MainFeed";
import { cafeApiURL, HomeScale } from "../Main";
import CafeSpotFeed from "../../sections/SpotFeed";

const CafeSpotPage = () => {
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
      <CafeSpotFeed searchedCafeList={cafeApi} spotName="판교" />
    </HomeScale>
  );
};

export default CafeSpotPage;
