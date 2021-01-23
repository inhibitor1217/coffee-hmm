import React, { useContext } from 'react';
import { CarouselIndexCtx } from '../../../context';
import './index.css';

type PositionDotHorizontalProps = {
    dotNum: number;
}

const PositionDotHorizontal = ({dotNum}: PositionDotHorizontalProps) => {
    const { carouselIndexCtx } = useContext(CarouselIndexCtx);
    const array = Array(dotNum).fill(null);
    
    return(
        <ul className="dot-list">
            {array.map((order, index) => {
                return <li style={{backgroundColor: (carouselIndexCtx === null?  dotNum-1 : carouselIndexCtx) === Math.abs(index-dotNum+1)? "#595959" : "#D9D9D9"}} key={index}></li>
            })}
        </ul>
    )
}

export default PositionDotHorizontal;