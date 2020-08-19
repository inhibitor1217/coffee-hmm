import React, { useState } from "react";
import { CafeInfo } from "../../sections/Cafes";
import Filter from "../../sections/Filters";
import Map from "../../sections/Map";
import "./index.css";

const HomePage = () => {
  const [filter, setFilter] = useState<((cafe: CafeInfo) => boolean) | null>(
    null
  );

  return (
    <div className="home">
      <Map filter={filter} />
      <Filter setFilter={setFilter} />
    </div>
  );
};

export default HomePage;
