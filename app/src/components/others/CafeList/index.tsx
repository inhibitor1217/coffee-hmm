import React, { useEffect, useState } from 'react';
import { moveDownOrRight, moveUpOrLeft, slideImageSize, slidePosition } from '../../../utils/function';
import { StyledColumnFlex } from '../../../utils/styled';
import { CafeInfo } from '../../../utils/type';
import { getAllCafesByName } from '../../api';
import CafeListOneCafe from '../CafeListOneCafe';
import NoSearchResult from '../NoSearchResult';
import './index.css';

type CafeListProps = {
    searchValue: string;
}

const CENTER = 40;
const TOP = -260;
const BOTTOM = 400;

const CafeList = ({searchValue}: CafeListProps) => {
    const [cafes, setCafes] = useState<CafeInfo[]>([])
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        async function fetchData(){
            await getAllCafesByName(searchValue).then(data => {
                setCafes(data);
            });
        }
        if(searchValue !== ""){
            fetchData();
        }
    }, [searchValue])


    const isEmptyArray = (array: CafeInfo[]) => {
        return (! Array.isArray(array) || !array.length );
    }

    if(isEmptyArray(cafes)){
        return(
            <NoSearchResult searchValue={searchValue}/>
        )
    }

    return(
        <div>
            <div className="search-header">{searchValue} 카페 검색 결과 <span>{cafes?.length}</span></div>
            <div className="search-result">
                {cafes?.map((cafe, index) => {
                    return(
                        <div key={cafe.id}  className="cafe" style={{
                                                top: currentIndex === index? slidePosition(index, currentIndex, CENTER, TOP, BOTTOM): slidePosition(index, currentIndex, CENTER, TOP, BOTTOM)
                                            }}>
                            <CafeListOneCafe index={index} currentIndex={currentIndex} cafe={cafe} isBig={slideImageSize(index, currentIndex)}/>
                        </div>)
                })}
                <StyledColumnFlex className="result-button-wrapper">
                    <button onClick={()=>moveUpOrLeft(currentIndex, setCurrentIndex)}><img src="/images/icon9.png" alt="up"/>up</button>
                    <button onClick={()=>moveDownOrRight(currentIndex, setCurrentIndex, cafes.length-1)}> <img src="/images/icon11.png" alt="down"/> down</button>
                </StyledColumnFlex>
            </div>
            <div className="search-bottom">버튼을 눌러 카페를 확인하세요<span><img src="/images/arrow.png" alt="arrow"/></span></div>
        </div>
       
    )
}

export default CafeList;