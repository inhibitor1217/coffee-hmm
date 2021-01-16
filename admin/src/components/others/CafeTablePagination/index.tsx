import React from 'react';
import './index.css';

type CafeTablePaginationProps = {
    currentPage: number;
    setCurrentPage: (page: number) => void;
    endingPage: number;
}

const CafeTablePagination = ({currentPage, setCurrentPage, endingPage}: CafeTablePaginationProps) => {
    const movePage = (isNext: boolean) => {
        if(isNext){
            if(currentPage < endingPage){
                setCurrentPage(currentPage+1);
            } 
        }else{
            if(currentPage > 1){
                setCurrentPage(currentPage-1);
            }
        }
    }

    return(
        <div className="cafe-pagination-wrapper">
            <button onClick={() => movePage(false)}><i className="material-icons">navigate_before</i></button>
            <span>{currentPage}</span>
            <button onClick={() => movePage(true)}><i className="material-icons">navigate_next</i></button>
        </div>
    )
}

export default CafeTablePagination;