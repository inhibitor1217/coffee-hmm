import React, { useState, useEffect } from "react";
import { CafeInfo } from "../../sections/Cafes";
import Filter from "../../sections/Filters";
import Map from "../../sections/Map";
import "./index.css";

export const URL =
  "https://ird14dr4ze.execute-api.ap-northeast-2.amazonaws.com/production/cafe";

interface CafeBasicInfo {
  id: string;
  name: string;
  imageUris: string[];
  mainImageUri: string;
}
export type CafeList = {
  cafes?: Array<CafeBasicInfo>;
};

const HomePage = () => {
  const [filter, setFilter] = useState<((cafe: CafeInfo) => boolean) | null>(
    null
  );

  const [cafeApi, setCafeApi] = useState<CafeList>();

  useEffect(() => {
    async function fetchData() {
      await fetch(URL)
        .then((response) => response.json())
        .then((jsonData) => JSON.stringify(jsonData))
        .then((jsonStr) => setCafeApi({ cafes: JSON.parse(jsonStr).Items }))
        .catch((error) => console.log("Error: ", error));
    }
    fetchData();
  }, []);

  return (
    <div className="home">
      <Map cafes={cafeApi} filter={filter} />
      <Filter setFilter={setFilter} />
    </div>
  );
};

export default HomePage;
