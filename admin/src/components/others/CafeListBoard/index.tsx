import React, { useEffect, useState } from 'react';
import { StyledFlexRow } from '../../../utils/Styled';
import { TypeCafe } from '../../../utils/Type';
import CafeListButtons from '../CafeListButtons';
import CafeSearchResultTable from '../CafeSearchResultTable';
import CafeTablePagination from '../CafeTablePagination';
import SearchBar from '../SearchBar';
import './index.css';

type CafeListBoardProps = {
    cafes: TypeCafe[];
    pageLoading: boolean;
    setPageLoading: (pageLoading: boolean) => void;
}

const CafeListBoard = ({cafes, pageLoading, setPageLoading}: CafeListBoardProps) => {    
    const [searchTarget, setSearchTarget] = useState<string>("");
    const [searchResults, setSearchResults] = useState<TypeCafe[]>(cafes);
    const [searchResultsVisible, setSearchResultsVisible] = useState<TypeCafe[]>([]);
    const [isVisibleOnly, setVisibleOnly] = useState<boolean>(false);

    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage] = useState(10);
    const indexOfLastRow = currentPage * rowsPerPage;
    const indexOfFirstRow = indexOfLastRow - rowsPerPage;
    const rowsOnCurrentPage = (isVisibleOnly? searchResultsVisible : searchResults).slice(indexOfFirstRow, indexOfLastRow);
    const endingPage = (isVisibleOnly? searchResultsVisible : searchResults).length / rowsPerPage;
    
    useEffect(() => {
        if(searchTarget !== "") {      
            const filteredCafes: TypeCafe[] = cafes.filter(cafe => (cafe.name === searchTarget));
            setSearchResults(filteredCafes);
        }
    }, [cafes, searchTarget]);

    useEffect(() => {
        async function clickVisibleOnly(){
            const filteredVisibleCafes: TypeCafe[] = searchResults.filter(cafe => (cafe.state === "active"));
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