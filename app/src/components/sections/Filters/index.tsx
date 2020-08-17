import React from "react";
import "./index.css";
import { CafeInfo } from "../Cafes";

interface FilterProps {
  setFilter(filter: () => (cafe: CafeInfo) => boolean): void;
}

const Filter = (props: FilterProps) => {
  const btnUri1 = props ? `url(images/green.png)` : undefined;
  const btnUri2 = props ? `url(images/gray.png)` : undefined;
  return (
    <div id="filters">
      <button
        className="btn"
        style={{
          backgroundImage: btnUri1,
        }}
        onClick={() =>
          props.setFilter(() => (cafe) => cafe.americanoPrice >= 3000)
        }
      >
        저렴한곳
      </button>
      <button
        className="btn"
        style={{
          backgroundImage: btnUri2,
        }}
        onClick={() => props.setFilter(() => (cafe) => cafe.isVisited)}
      >
        다녀온곳
      </button>
    </div>
  );
};

export default Filter;
