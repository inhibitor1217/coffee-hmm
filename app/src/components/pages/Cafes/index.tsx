import React from "react";
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

interface CafeProps_Info {
  message: string;
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

const Cafes = (props: CafesProps) => {
  return (
    <div>
      {props.cafes.map((cafe) => {
        return (
          <div
            id="space"
            style={{
              width: Math.random() * 40 + 60,
              // height: Math.random() * 30 + 40
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
