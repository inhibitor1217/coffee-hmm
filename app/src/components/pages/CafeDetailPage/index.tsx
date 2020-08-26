import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { CafeInfo } from "../../sections/Cafe";
import { cafeApiURL } from "../Homepage";
import CafeDetails from "../../sections/CafeDetails";

const CafeDetailPage = () => {
  const { cafeId }: { cafeId: string } = useParams();
  const [cafeApi, setCafeApi] = useState<CafeInfo | null>(null);
  useEffect(() => {
    async function fetchData() {
      await fetch(cafeApiURL + `/${cafeId}`)
        .then((response) => response.json())
        .then((jsonStr) => setCafeApi(jsonStr.Item))
        .catch((error) => console.log("Error: ", error));
    }
    fetchData();
  }, [cafeId]);
  return (
    <div>
      <CafeDetails cafe={cafeApi} />
    </div>
  );
};

export default CafeDetailPage;
