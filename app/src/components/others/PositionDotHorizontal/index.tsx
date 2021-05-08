import React from 'react';
import './index.css';

type PositionDotHorizontalProps = {
  dotNum: number;
  currentIndex: number;
};

const PositionDotHorizontal = ({
  dotNum,
  currentIndex,
}: PositionDotHorizontalProps) => {
  const array = Array(dotNum).fill(null);

  return (
    <ul className="dot-list">
      {array.map((order, index) => {
        return (
          <li
            style={{
              backgroundColor: index === currentIndex ? '#595959' : '#D9D9D9',
            }}
            key={index}
          ></li>
        );
      })}
    </ul>
  );
};

export default PositionDotHorizontal;
