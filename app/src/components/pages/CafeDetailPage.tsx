import React from "react";
import { useParams } from "react-router";

const CafeDetailPage = () => {
  const { cafeId }: { cafeId: string } = useParams();
  return <div>Cafe detail page: {cafeId}</div>;
};

export default CafeDetailPage;
