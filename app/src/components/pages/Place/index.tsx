import React, { useState, useEffect } from "react";
import { CafeInfo } from "../../sections/MainFeed";
import { cafeApiURL, HomeScale } from "../Main";
import { useParams } from "react-router";
import PlaceFeed from "../../sections/PlaceFeed";

const CafeSpotPage = () => {
  const { place }: { place: string } = useParams();
  const [cafeApi, setCafeApi] = useState<CafeInfo[] | null>(null);

  useEffect(() => {
    async function fetchData() {
      await fetch(cafeApiURL + "?place=" + place)
        .then((response) => response.json())
        .then((jsonData) => JSON.stringify(jsonData))
        .then((jsonStr) => setCafeApi(JSON.parse(jsonStr)))
        .catch((error) => console.log("Error: ", error));
    }
    fetchData();
  }, [place]);

  return (
    <HomeScale>
      <PlaceFeed searchedCafeList={cafeApi} placeName={place} />
    </HomeScale>
  );
};

export default CafeSpotPage;
