import React, { useState } from "react";
import { CafeInfo } from "../Cafes";
import Filter from "../Filters";
import Map from "../Map";

const HomePage = () => {
  const [filter, setFilter] = useState<((cafe: CafeInfo) => boolean) | null>(
    null
  );

  return (
    <div>
      <Map filter={filter} />
      <Filter setFilter={setFilter} />
    </div>
  );
};

export default HomePage;
