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
        className="btn"
        onClick={() => props.setFilter(() => (cafe) => cafe.avgPrice >= 3000)}
      >
        {/* <a href="#" className="filter_btn">
          price
        </a> */}
        price
      </button>
      <button
        className="btn"
        onClick={() => props.setFilter(() => (cafe) => cafe.isVisited)}
      >
        {/* <a href="#" className="filter_btn">
          history
        </a> */}
        history
      </button>
    </div>
  );
};

export default Filter;
