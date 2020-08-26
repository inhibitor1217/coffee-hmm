import React, { useState, useEffect } from "react";
import "./index.css";
import Cafe, { CafeInfo } from "../Cafe";
import Street from "../Street";

// export type CafeList = {
//   cafes?: CafeInfo[];
// };

export type CafesProps = {
  cafes: CafeInfo[] | null;
  filter: ((cafe: CafeInfo) => boolean) | null;
};

const getRanNum = (min: number, max: number) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

let pencilBoxList = ["sq1", "sq2", "sq3", "sq4"];
let lineImageList = [
  "line1",
  "line2",
  "line3",
  "line4",
  "line5",
  "line6",
  "line7",
];

const Cafes = (props: CafesProps) => {
  const [visibleCafeIndex, setVisibleCafeIndex] = useState<number | null>(null);
  const [boxes, setBoxes] = useState<string[]>([]);
  const [lineImages, setLineImages] = useState<string[]>([]);

  useEffect(() => {
    const tempBoxes: string[] = [];
    const tempImages: string[] = [];

    props.cafes?.map(() => {
      tempBoxes.push(pencilBoxList[getRanNum(0, 3)]);
      tempImages.push(lineImageList[getRanNum(0, 6)]);
    });

    setBoxes(tempBoxes);
    setLineImages(tempImages);
  }, [props.cafes]);

  const imageUri = props.cafes ? `url(/images/red_line.png)` : undefined;
  return (
    <div className="pbox">
      <div className="cafes">
        {props.cafes?.map((cafe, idx) => {
          return (
            <Cafe
              cafe={cafe}
              idx={idx}
              props={props}
              boxes={boxes}
              lineImages={lineImages}
              hidden={visibleCafeIndex === idx ? false : true}
              toggleVisible={() => {
                if (visibleCafeIndex === idx) {
                  setVisibleCafeIndex(null);
                } else {
                  setVisibleCafeIndex(idx);
                }
              }}
              key={cafe.name}
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
          let length: number;
          if (props.cafes != null) {
            length = props.cafes.length;
          } else {
            length = 0;
          }
          for (let i = 0; i < length / 6 - 1; i++) {
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
