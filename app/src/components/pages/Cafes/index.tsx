import React, { useState, useEffect } from "react";
import "./index.css";

export type Cafe = {
  title: string;
  lat: number;
  avgPrice: number;
  isVisited: boolean;
};

type CafesProps = {
  cafes: Cafe[];
  filter: ((cafe: Cafe) => boolean) | null;
};

const Cafes = (props: CafesProps) => {
  const [widths, setWidths] = useState<number[]>([]);

  useEffect(() => {
    const widths = [];
    for (let i = 0; i < props.cafes.length; i++) {
      widths.push(Math.random() * 40 + 60);
    }
    setWidths(widths);
  }, [props.cafes.length]);

  return (
    <div>
      {props.cafes.map((cafe, idx) => {
        return (
          <div
            id="space"
            style={{
              width: widths[idx],
              backgroundColor:
                props.filter !== null
                  ? props.filter(cafe)
                    ? "beige"
                    : "#EDE7F6"
                  : "beige",
            }}
            key={cafe.title}
          >
            {cafe.title}
          </div>
        );
      })}
      <div id="infoArea"></div>
    </div>
  );
};

export default Cafes;
