import React, { useState, useEffect } from "react";
import "./index.css";
import Cafe from "../Cafe";

export type CafeInfo = {
  title: string;
  lat: number;
  avgPrice: number;
  isVisited: boolean;
};

export type CafesProps = {
  cafes: CafeInfo[];
  filter: ((cafe: CafeInfo) => boolean) | null;
};

const Cafes = (props: CafesProps) => {
  const [widths, setWidths] = useState<number[]>([]);

  useEffect(() => {
    const tempWidths = [];
    for (let i = 0; i < props.cafes.length; i++) {
      tempWidths.push(Math.random() * 40 + 60);
    }
    setWidths(tempWidths);
  }, [props.cafes.length]);

  return (
    <div>
      {props.cafes.map((cafe, idx) => {
        return (
          <Cafe
            cafe={cafe}
            widths={widths}
            idx={idx}
            props={props}
            key={cafe.title}
          />
        );
      })}
    </div>
  );
};

export default Cafes;
