import React, { useState, useEffect } from "react";
import { useParams } from "react-router";
import { CafeInfo } from "../../sections/MainFeed";
import { cafeApiURL } from "../Main";
import CafeDetailInfo from "../../sections/CafeDetailInfo";

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
      <CafeDetailInfo cafe={cafeApi} />
    </div>
  );
};

export default CafeDetailPage;
