import React from 'react';
import { StyledFlexColumn } from '../../../utils/Styled';
import { TypeReview } from '../../../utils/Type';
import Loading from '../../common/loading';
import CafeDetailReviewTableColumns from '../CafeDetailReviewTableColumns';
import CafeDetailReviewTableRow from '../CafeDetailReviewTableRow';
import './index.css';

type CafeDetailReviewTableProps = {
    reviews: TypeReview[];
    reviewLoading: boolean;
    isPreview: boolean;
    deletedReviews: string[];
    setDeletedReviews: (deletedReviews: string[]) => void;
    isCheckedAll: boolean;
    setCheckedAll: (isCheckedAll: boolean) => void;
}

const CafeDetailReviewTable = ({reviews, reviewLoading, isPreview, deletedReviews, setDeletedReviews, isCheckedAll, setCheckedAll}: CafeDetailReviewTableProps) => {    
    if(reviewLoading){
        return <Loading/>
    }
    
    return(
        <StyledFlexColumn className="review-list">
            <CafeDetailReviewTableColumns isPreview={isPreview} reviews={reviews}
                                        deletedReviews={deletedReviews} setDeletedReviews={setDeletedReviews}
                                        isCheckedAll={isCheckedAll} setCheckedAll={setCheckedAll}/>
            <div className="review-list-wrapper">
            {reviews.map((review, index) => {
                return(
                    <CafeDetailReviewTableRow key={index} review={review} isPreview={isPreview} 
                                            deletedReviews={deletedReviews} setDeletedReviews={setDeletedReviews} 
                                            isCheckedAll={isCheckedAll}/>
                )
            })}
            </div>
            <div className="no-review-statement" style={{display: (reviews.length === 0)? "block" : "none"}}>등록된 리뷰가 없습니다.</div>
        </StyledFlexColumn>     
    )
}

export default CafeDetailReviewTable;