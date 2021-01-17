import React, { useEffect, useState } from 'react';
import { CafeInfo } from '../../../utils/type';
import { getAllCafesByName } from '../../api';
import CafeDetail from '../CafeDetail';
import CafeImageCarousel from '../CafeImageCarousel';
import NoSearchResult from '../NoSearchResult';
import './index.css';

type CafeListProps = {
    searchValue: string;
}

const CafeList = ({searchValue}: CafeListProps) => {
    const [cafes, setCafes] = useState<CafeInfo[]>([])
    const [cafe, setCafe] = useState<CafeInfo | null>(null);

    useEffect(() => {
        async function fetchData(){
            await getAllCafesByName(searchValue).then(data => {
                setCafes(data);
            });
        }
        fetchData();
    },[searchValue])


    const isEmptyArray = (array: CafeInfo[]) => {
        return (! Array.isArray(array) || !array.length );
    }

    if(isEmptyArray(cafes)){
        return(
            <NoSearchResult searchValue={searchValue}/>
        )
    }

    return(
        <div className="search-container">
            <div className="search-header">{searchValue} 카페 검색 결과 <span>{cafes?.length}</span></div>  
            <div className="search-wrapper">
                <CafeImageCarousel cafes={cafes} setCafe={setCafe}/>
            </div>   
            {cafe && 
            <div className="cafe-detail" style={{display: cafe? "block" : "none"}}>
                <CafeDetail cafe={cafe} setCafe={setCafe}/>
            </div>
            }  
        </div>       
    )
}
export default CafeList;