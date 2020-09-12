import React, { useState, useEffect } from "react";
import { HomeScale, cafeApiURL } from "../Main";
import PlaceGuide from "../../sections/PlaceGuide";
import { CafeInfo } from "../../sections/MainFeed";

const PlaceListPage = () => {
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

  const placeSet = new Set<string>();

  cafeApi?.forEach((cafe) => {
    placeSet.add(cafe.place);
  });

  const placeCategories = [...placeSet];

  return (
    <HomeScale>
      <PlaceGuide placeCategories={placeCategories} />
    </HomeScale>
  );
};

export default PlaceListPage;
