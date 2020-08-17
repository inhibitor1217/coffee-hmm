import React from "react";
import "./index.css";
import { CafeInfo } from "../Cafes";

interface FilterProps {
  setFilter(filter: () => (cafe: CafeInfo) => boolean): void;
}

const Filter = (props: FilterProps) => {
  const btnUri = props ? `url(images/green.png)` : undefined;
  return (
    <div id="filters">
      <button
        className="btn btn-price"
        style={{
          backgroundImage: btnUri,
        }}
        onClick={() =>
          props.setFilter(() => (cafe) => cafe.americanoPrice >= 3000)
        }
      >
        price
      </button>
      <button
        className="btn"
        onClick={() => props.setFilter(() => (cafe) => cafe.isVisited)}
      >
        history
      </button>
    </div>
  );
};

export default Filter;
