import React, { useEffect, useState } from 'react';
import { StyledFlexRow } from '../../../utils/Styled';
import { TypeReview } from '../../../utils/Type';
import CafeDetailReviewTable from '../CafeDetailReviewTable';
import CafeReviewButtons from '../CafeReviewButtons';
import CafeTablePagination from '../CafeTablePagination';
import SearchBar from '../SearchBar';
import './index.css';

type CafeReviewBoardProps = {
    name: string;
    reviews: TypeReview[];
    reviewLoading: boolean;
    isCheckedAll: boolean;
    setCheckedAll: (isCheckedAll: boolean) => void;
}

const CafeReviewBoard = ({name, reviews, reviewLoading, isCheckedAll, setCheckedAll}: CafeReviewBoardProps) => {
    const [deletedReviews, setDeletedReviews] = useState<string[]>([]);
    const [searchTarget, setSearchTarget] = useState<string>("");
    const [searchResults, setSearchResults] = useState<TypeReview[]>(reviews);
    
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage] = useState(10);
    const indexOfLastRow = currentPage * rowsPerPage;
    const indexOfFirstRow = indexOfLastRow - rowsPerPage;
    const rowsOnCurrentPage = searchResults.slice(indexOfFirstRow, indexOfLastRow);
    const endingPage = searchResults.length / rowsPerPage;

    useEffect(() => {
        if(deletedReviews.length === reviews.length || deletedReviews.length === 10){
            setCheckedAll(true);
        }else if(deletedReviews.length === 0){
            setCheckedAll(false);
        }
     }, [deletedReviews, reviews, setCheckedAll])

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
       e.preventDefault();
        // fetch delete
    }


    useEffect(() => {
        async function filter(){
            if(searchTarget === "") return reviews;
    
            const filteredReviews: TypeReview[] = reviews.filter(review => (review.userId.toString() === searchTarget || review.createdAt === searchTarget));
            return filteredReviews;
        }

        filter().then(reviews => setSearchResults(reviews));
    }, [reviews, searchTarget]);

    return(
        <div className="board-container">
            <div className="title-button-container">
                <div>
                    <h3>카페 <span>({reviews.length})</span></h3>
                    <h5>{name}에 등록된 리뷰입니다.</h5>
                </div>
            </div>
    
            <StyledFlexRow className="bar-table-container">
                <SearchBar placeHolder="유저 아이디 또는 일자로 리뷰 찾기" setSearchTarget={setSearchTarget} />
                <CafeTablePagination currentPage={currentPage} setCurrentPage={setCurrentPage} endingPage={endingPage}/>
            </StyledFlexRow>

            <form onSubmit={handleSubmit}>
                <CafeReviewButtons/>
                <CafeDetailReviewTable reviews={rowsOnCurrentPage} reviewLoading={reviewLoading} isPreview={false} 
                                        deletedReviews={deletedReviews} setDeletedReviews={setDeletedReviews}
                                        isCheckedAll={isCheckedAll} setCheckedAll={setCheckedAll}/>
            </form>
        </div>
    )
}

export default CafeReviewBoard;