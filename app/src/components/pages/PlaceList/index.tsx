import React, { useState, useEffect } from "react";
import PlaceGuide from "../../sections/PlaceGuide";
import { CafeInfo, HomeScale, cafeApiURL } from "../../../utils";

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

  const placeArray = cafeApi?.map((cafe) => cafe.place);
  const placeSet = new Set<string>(placeArray);

  return (
    <HomeScale>
      <PlaceGuide placeCategories={[...placeSet]} />
    </HomeScale>
  );
};

export default PlaceListPage;
