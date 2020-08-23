import React, { useState, useEffect } from "react";
import { CafeInfo } from "../../sections/Cafes";
import Filter from "../../sections/Filters";
import Map from "../../sections/Map";
import "./index.css";

export const URL =
  "https://ird14dr4ze.execute-api.ap-northeast-2.amazonaws.com/production/cafe";

interface cafeBasicInfo {
  id: string;
  name: string;
  imageUris: string[];
  mainImageUri: string;
}
interface cafeListState {
  cafes?: Array<cafeBasicInfo>;
}

const HomePage = () => {
  const [filter, setFilter] = useState<((cafe: CafeInfo) => boolean) | null>(
    null
  );

  const [state, setState] = useState<cafeListState>();

  useEffect(() => {
    async function fetchData() {
      await fetch(URL)
        .then((response) => response.json())
        .then((jsonData) => JSON.stringify(jsonData))
        .then(function (data) {
          let jsonStr = JSON.parse(data);
          for (let i = 0; i < jsonStr.Count; i++) {
            //console.log(jsonStr.Items[i]);
            const newData: cafeBasicInfo = jsonStr.Items[i];
            setState((prevState) => ({
              cafes: [...(prevState?.cafes ?? []), newData],
            }));
          }
        })
        .catch((error) => console.log("Error: ", error));
    }
    fetchData();
  }, []);

  return (
    <div className="home">
      <ul>
        {state?.cafes?.map((cafe) => (
          <li key={cafe.id}>{cafe.id}</li>
        ))}
      </ul>
      <Map filter={filter} />
      <Filter setFilter={setFilter} />
    </div>
  );
};

export default HomePage;
