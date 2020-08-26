import React from "react";
import "./index.css";
<<<<<<< HEAD
import { CafeInfo } from "../Cafe";
=======
import { CafeInfo } from "../Cafes";
>>>>>>> ad6b733199c338f2f49cc4d1dcf1102b1f795704

interface FilterProps {
  setFilter(filter: () => (cafe: CafeInfo) => boolean): void;
}

const Filter = (props: FilterProps) => {
  const btnUri1 = props ? `url(images/green.png)` : undefined;
<<<<<<< HEAD
  // const btnUri2 = props ? `url(images/gray.png)` : undefined;
=======
  const btnUri2 = props ? `url(images/gray.png)` : undefined;
>>>>>>> ad6b733199c338f2f49cc4d1dcf1102b1f795704
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
<<<<<<< HEAD
      {/* <button
=======
      <button
>>>>>>> ad6b733199c338f2f49cc4d1dcf1102b1f795704
        className="btn"
        style={{
          backgroundImage: btnUri2,
        }}
        onClick={() => props.setFilter(() => (cafe) => cafe.isVisited)}
      >
        다녀온곳
<<<<<<< HEAD
      </button> */}
=======
      </button>
>>>>>>> ad6b733199c338f2f49cc4d1dcf1102b1f795704
    </div>
  );
};

export default Filter;
