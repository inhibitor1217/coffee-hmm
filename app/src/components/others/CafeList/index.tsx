import React, { useContext } from 'react';
import { SearchValueCtx } from '../../../context';
import { CafeInfo } from '../../../utils/type';
import CafeCarousel from '../CafeCarousel';
import NoSearchResult from '../NoSearchResult';
import './index.css';

type CafeListProps = {
    cafes: CafeInfo[];
}

const CafeList = ({cafes}: CafeListProps) => {
    const { searchValueCtx } = useContext(SearchValueCtx); // FIX: props 로 대체

    const isEmptyArray = (array: CafeInfo[]) => {
        return (! Array.isArray(array) || !array.length );
    }

    if(isEmptyArray(cafes)){
        return(
            <NoSearchResult searchValue={searchValueCtx}/>
        )
    }

    return(
        <div className="search-container">
            <div className="search-header">
                <span>카페 검색 결과 </span>
                <span>{cafes?.length}</span>
                <button>&#x2b; Add New</button>
            </div>  
            <div className="search-wrapper">
                <CafeCarousel cafes={cafes} />
            </div>   
        </div>       
    )
}
export default CafeList;