import React from 'react';
import { TypeCafe } from '../../../utils/type';
import CafeCarousel from '../CafeCarousel';
import './index.css';

type CafeListProps = {
    cafes: TypeCafe[];
}

const CafeList = ({cafes}: CafeListProps) => {
    return(
        <div className="search-container">
            <div className="search-header">
                <span>카페 검색 결과 </span>
                <span>{cafes?.length}</span>
                <button>&#x2b; Add New</button>
            </div>  
            <div className="search-wrapper">
                <CafeCarousel cafes={cafes}/>
            </div>   
        </div>       
    )
}
export default CafeList;