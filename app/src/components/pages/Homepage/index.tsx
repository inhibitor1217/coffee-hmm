import React, { useState, useEffect } from "react";
import Filter from "../../sections/Filters";
import Map from "../../sections/Map";
import "./index.css";
import { CafeInfo } from "../../sections/Cafe";

export const cafeApiURL =
  "https://ird14dr4ze.execute-api.ap-northeast-2.amazonaws.com/production/cafe";

const HomePage = () => {
  const [filter, setFilter] = useState<((cafe: CafeInfo) => boolean) | null>(
    null
  );
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
    <div className="home-page">
      <Map cafeList={cafeApi} filter={filter} />
      <Filter setFilter={setFilter} />
    </div>
  );
};

export default HomePage;
