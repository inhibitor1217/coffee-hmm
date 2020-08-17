import React, { useState } from "react";
import { CafeInfo } from "../../sections/Cafes";
import Filter from "../../sections/Filters";
import Map from "../../sections/Map";

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
