import React, { useContext } from 'react';
import { CafeCtx } from '../../../context';
import CafeDetail from '../../others/CafeDetail';
import './index.css';

const Detail = () => {
    const { cafeCtx } = useContext(CafeCtx);

    return(
        <div className="cafe-detail">
            <CafeDetail cafe={cafeCtx} />
        </div>
    )
}

export default Detail;