import React, { useState } from "react";
import Map from "./Map";
import { Cafe } from './Cafes';
import Filter from "./Filter";
import './Filter.css';


const HomePage = () => {

  const [filter, setFilter] = useState<((cafe: Cafe) => boolean) | null>(null);

  return (
  <div id='homepage'>
    <Map filter={filter}/>
    <Filter setFilter={setFilter}/>
  </div>
    );
};

export default HomePage;
