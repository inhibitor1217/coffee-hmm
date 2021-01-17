import React, { useEffect, useState } from 'react';
import { CafeInfo } from '../../../utils/type';
import { getAllCafesByName } from '../../api';
import CafeImageCarousel from '../CafeImageCarousel';
import NoSearchResult from '../NoSearchResult';
import './index.css';

type CafeListProps = {
    searchValue: string;
}

const CafeList = ({searchValue}: CafeListProps) => {
    const [cafes, setCafes] = useState<CafeInfo[]>([])

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
                <CafeImageCarousel cafes={cafes}/>
            </div>     
        </div>       
    )
}
export default CafeList;