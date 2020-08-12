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

const getRandomColor = () => {
  let min = Math.ceil(0);
  let max = Math.floor(11);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

let colorsList = [
  "#FFEBEE",
  "#E8EAF6",
  "#E3F2FD",
  "#E1F5FE",
  "#E0F2F1",
  "#E8F5E9",
  "#F9FBE7",
  "#FFF8E1",
  "#FBE9E7",
  "#F0F4C3",
  "#FFF9C4",
  "#FFE0B2",
];

const Cafes = (props: CafesProps) => {
  const [widths, setWidths] = useState<number[]>([]);
  const [colors, setColors] = useState<string[]>([]);
  const [visibleCafeIndex, setVisibleCafeIndex] = useState<number | null>(null);

  useEffect(() => {
    const tempWidths = [];
    const tempColors = [];

    for (let i = 0; i < props.cafes.length; i++) {
      tempWidths.push(Math.random() * 40 + 60);
      tempColors.push(colorsList[getRandomColor()]);
    }
    setWidths(tempWidths);
    setColors(tempColors);
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
            colors={colors}
            hidden={visibleCafeIndex === idx ? "visible" : "hidden"}
            toggleVisible={() => {
              if (visibleCafeIndex === idx) {
                setVisibleCafeIndex(null);
              } else {
                setVisibleCafeIndex(idx);
              }
            }}
            key={cafe.title}
          />
        );
      })}
    </div>
  );
};

export default Cafes;
