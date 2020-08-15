import React, { useState, useEffect } from "react";
import "./index.css";
import Cafe from "../Cafe";
import Street from "../Street";

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

const getRanNum = (min: number, max: number) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// let colorsList = [
//   "#FFEBEE",
//   "#E8EAF6",
//   "#E3F2FD",
//   "#E1F5FE",
//   "#E0F2F1",
//   "#E8F5E9",
//   "#F9FBE7",
//   "#FFF8E1",
//   "#FBE9E7",
//   "#F0F4C3",
//   "#FFF9C4",
//   "#FFE0B2",
// ];

let pencilBoxList = ["sq1", "sq2", "sq3", "sq4"];

const Cafes = (props: CafesProps) => {
  const [visibleCafeIndex, setVisibleCafeIndex] = useState<number | null>(null);
  const [boxes, setBoxes] = useState<string[]>([]);

  useEffect(() => {
    const tempBoxes = [];
    for (let i = 0; i < props.cafes.length; i++) {
      tempBoxes.push(pencilBoxList[getRanNum(0, 3)]);
    }
    setBoxes(tempBoxes);
  }, [props.cafes.length]);

  const imageUri = props.cafes ? `url(/images/red_line.png)` : undefined;

  return (
    <div className="pbox">
      <div className="cafes">
        {props.cafes.map((cafe, idx) => {
          return (
            <Cafe
              cafe={cafe}
              idx={idx}
              props={props}
              boxes={boxes}
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
      <div
        className="street"
        style={{
          backgroundImage: imageUri,
        }}
      >
        {(function () {
          let rows = [];
          for (let i = 0; i < props.cafes.length / 6 - 1; i++) {
            rows.push(<Street key={i} />);
            // temporary Key
          }
          return rows;
        })()}
      </div>
    </div>
  );
};

export default Cafes;
