import React from "react";
import "./index.css";
import { CafeInfo } from "../Cafes";

interface FilterProps {
  setFilter(filter: () => (cafe: CafeInfo) => boolean): void;
}

const Filter = (props: FilterProps) => {
  return (
    <div id="footer">
      <button
        className="filters"
        onClick={() => props.setFilter(() => (cafe) => cafe.avgPrice >= 3000)}
      >
        PRICE
      </button>
      <button
        className="filters"
        onClick={() => props.setFilter(() => (cafe) => cafe.isVisited)}
      >
        VISITED
      </button>
      <button className="filters">filter 3</button>
    </div>
  );
};

export default Filter;
