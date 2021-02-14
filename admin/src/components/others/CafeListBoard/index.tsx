import React, { useLayoutEffect, useState } from 'react';
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
}

const CafeListBoard = ({cafes, pageLoading}: CafeListBoardProps) => {    
    const [searchTarget, setSearchTarget] = useState<string>("");
    const [searchResults, setSearchResults] = useState<TypeCafe[]>(cafes);

    const [rowsOnCurrentPage, setRowsOnCurrentPage] = useState<TypeCafe[] | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage] = useState(10);
    const indexOfLastRow = currentPage * rowsPerPage;
    const indexOfFirstRow = indexOfLastRow - rowsPerPage;
    const endingPage = searchResults.length / rowsPerPage;

    const [showHidden, setShowHidden] = useState<boolean>(false);
    

    useLayoutEffect(() => {
        if (searchTarget !== "") {      
            setSearchResults(cafes.filter(cafe => (cafe.name === searchTarget)));
        }else {
            setSearchResults(cafes);
        }
    }, [cafes, searchTarget]);

    useLayoutEffect(() => {
        setRowsOnCurrentPage(searchResults.slice(indexOfFirstRow, indexOfLastRow))
    }, [indexOfFirstRow, indexOfLastRow, searchResults])

    const handleShowHidden = () => {
        if (showHidden) {
            setSearchResults(searchResults.filter(cafe => (cafe.state === 'active')));
            setShowHidden(false);
        }else {
            setSearchResults(cafes);
            setShowHidden(true);
        }
    }

    return(
        <div className="board-container">
            <StyledFlexRow className="title-button-container">
                <div>
                    <h3>카페 <span>({searchResults.length})</span></h3>
                    <h5>커피흠에 등록된 카페입니다.</h5>
                </div>
                <CafeListButtons showHidden={showHidden} handleShowHidden={handleShowHidden} setSearchTarget={setSearchTarget}/>
            </StyledFlexRow>
      
            <StyledFlexRow className="bar-table-container">
                <SearchBar placeHolder="이름 또는 장소로 카페 찾기" setSearchTarget={setSearchTarget}/>
                <CafeTablePagination currentPage={currentPage} setCurrentPage={setCurrentPage} endingPage={endingPage}/>
            </StyledFlexRow>

            {rowsOnCurrentPage && <CafeSearchResultTable cafes={rowsOnCurrentPage} pageLoading={pageLoading}/>}
        </div>
    )
}

export default CafeListBoard;