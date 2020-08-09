import React, { useState } from "react";
import { Cafe } from "../Cafes";
import Filter from "../Filters";
import Map from "../Map";

const HomePage = () => {
  const [filter, setFilter] = useState<((cafe: Cafe) => boolean) | null>(null);

  return (
    <div>
      <Map filter={filter} />
      <Filter setFilter={setFilter} />
    </div>
  );
};

export default HomePage;
