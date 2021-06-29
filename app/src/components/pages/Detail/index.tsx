import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { TypeCafe } from "types";

import { getCafeById } from "components/api";
import CafeDetail from "components/others/CafeDetail";

import "./index.css";

const Detail: React.FC = () => {
  const { cafeId } = useParams<{ cafeId: string }>();
  const [cafe, setCafe] = useState<TypeCafe | null>(null);

  useEffect(() => {
    async function fetchData() {
      await getCafeById(cafeId).then((data) => {
        if (data) {
          setCafe(data.cafe);
        }
      });
    }
    fetchData();
  }, [cafeId]);

  return (
    <div className="cafe-detail">
      {cafe && <CafeDetail cafe={cafe} setCafe={setCafe} />}
    </div>
  );
};

export default Detail;
