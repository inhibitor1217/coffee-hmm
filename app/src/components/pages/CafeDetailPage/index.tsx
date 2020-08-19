import React from "react";
import CafeInformation from "../../sections/CafeInformation";
import { useParams } from "react-router";

const CafeDetailPage = () => {
  const { cafeId }: { cafeId: string } = useParams();

  return (
    <div>
      Cafe detail page: {cafeId}
      <CafeInformation />
    </div>
  );
};

export default CafeDetailPage;
