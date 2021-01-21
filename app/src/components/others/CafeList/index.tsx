import React, { useContext, useEffect, useState } from 'react';
import { CafeInfo } from '../../../utils/type';
import { getAllCafesByName } from '../../api';
import CafeDetail from '../CafeDetail';
import CafeCarousel from '../CafeCarousel';
import NoSearchResult from '../NoSearchResult';
import './index.css';
import { SearchValueCtx } from '../../../context';

const CafeList = () => {
    const [cafes, setCafes] = useState<CafeInfo[]>([])
    const [cafe, setCafe] = useState<CafeInfo | null>(null);
    const { searchValueCtx } = useContext(SearchValueCtx);

    useEffect(() => {
        async function fetchData(){
            await getAllCafesByName(searchValueCtx).then(data => {
                setCafes(data);
            });
        }
        fetchData();
    },[searchValueCtx])

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
                <CafeCarousel cafes={cafes} setCafe={setCafe}/>
            </div>   
     

    
            <div className="cafe-detail" style={{display: cafe !== null? "block" : "none"}}>
                <CafeDetail cafe={cafe || null} setCafe={setCafe}/>
            </div>
            
        </div>       
    )
}
export default CafeList;