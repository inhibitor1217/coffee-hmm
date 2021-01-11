import React, { useEffect, useState } from 'react';
import { StyledFlexRow } from '../../../utils/Styled';
import { Cafe } from '../../../utils/Type';
import CafeListButtons from '../CafeListButtons';
import CafeSearchResultTable from '../CafeSearchResultTable';
import CafeTablePagination from '../CafeTablePagination';
import SearchBar from '../SearchBar';
import './index.css';

type CafeListBoardProps = {
    cafes: Cafe[];
    pageLoading: boolean;
    setPageLoading: (pageLoading: boolean) => void;
}

const CafeListBoard = ({cafes, pageLoading, setPageLoading}: CafeListBoardProps) => {
    const [searchTarget, setSearchTarget] = useState<string>("");
    const [searchResults, setSearchResults] = useState<Cafe[]>(cafes);
    const [searchResultsVisible, setSearchResultsVisible] = useState<Cafe[]>([]);
    const [isVisibleOnly, setVisibleOnly] = useState<boolean>(false);

    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage] = useState(10);
    const indexOfLastRow = currentPage * rowsPerPage;
    const indexOfFirstRow = indexOfLastRow - rowsPerPage;
    const rowsOnCurrentPage = (isVisibleOnly? searchResultsVisible : searchResults).slice(indexOfFirstRow, indexOfLastRow);
    const endingPage = (isVisibleOnly? searchResultsVisible : searchResults).length / rowsPerPage;

    useEffect(() => {
        async function filter(){
            if(searchTarget === "") return cafes;
    
            const filteredCafes: Cafe[] = cafes.filter(cafe => (cafe.name === searchTarget));
            return filteredCafes;
        }

        filter().then(cafes => setSearchResults(cafes));
    }, [cafes, searchTarget]);

    useEffect(() => {
        async function clickVisibleOnly(){
            const filteredVisibleCafes: Cafe[] = searchResults.filter(cafe => (cafe.status === "visible"));
            setSearchResultsVisible(filteredVisibleCafes);
        }

        if(isVisibleOnly){
            clickVisibleOnly();
        }
    }, [isVisibleOnly, searchResults])

    return(
        <div className="board-container">
            <StyledFlexRow className="title-button-container">
                <div>
                    <h3>카페 <span>({(isVisibleOnly? searchResultsVisible : searchResults).length})</span></h3>
                    <h5>커피흠에 등록된 카페입니다.</h5>
                </div>
                <CafeListButtons isVisibleOnly={isVisibleOnly} setVisibleOnly={setVisibleOnly}/>
            </StyledFlexRow>
      
            <StyledFlexRow className="bar-table-container">
                <SearchBar placeHolder="이름 또는 장소로 카페 찾기" setSearchTarget={setSearchTarget}/>
                <CafeTablePagination currentPage={currentPage} setCurrentPage={setCurrentPage} endingPage={endingPage}/>
            </StyledFlexRow>

            <CafeSearchResultTable cafes={rowsOnCurrentPage} pageLoading={pageLoading}/>
        </div>
    )
}

export default CafeListBoard;