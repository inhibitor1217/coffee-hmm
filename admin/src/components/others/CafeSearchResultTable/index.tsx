import React from 'react';
import { StyledFlexColumn } from '../../../utils/Styled';
import { Cafe } from '../../../utils/Type';
import Loading from '../../common/loading';
import CafeSearchResultTableColumns from '../CafeSearchResultTableColumns';
import CafeSearchResultTableRow from '../CafeSearchResultTableRow';
import './index.css';

type CafeSearchResultTableProps = {
    cafes: Cafe[];
    pageLoading: boolean;
}

const CafeSearchResultTable = ({cafes, pageLoading}: CafeSearchResultTableProps) => {
    if(pageLoading){
        return(
            <Loading/>
        )
    }

    return(
        <StyledFlexColumn className="cafe-search-result">
            <CafeSearchResultTableColumns/>
            <div className="cafe-list-wrapper">
            {cafes.map(cafe => {
                return(
                    <CafeSearchResultTableRow key={cafe.id} cafe={cafe}/>
                )
            })}
            </div>   
            <div className="no-cafe-statement" style={{display: (cafes.length === 0)? "block" : "none"}}>등록된 카페가 없습니다.</div>
        </StyledFlexColumn>
    )
}

export default CafeSearchResultTable;