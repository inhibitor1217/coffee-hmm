import React, { useState } from 'react';
import { StyledFlexColumn, StyledFlexRow } from '../../../utils/Styled';
import { TypeCafe, TypeImage, TypeReview } from '../../../utils/Type';
import CafeDetailBasicInfo from '../CafeDetailBasicInfo';
import CafeDetailImageTable from '../CafeDetailImageTable';
import CafeRegisterForm from '../CafeRegisterForm';
import './index.css';

type CafeDetailBoardProps = {
    cafe: TypeCafe;
    images: TypeImage[];
    reviews: TypeReview[];
    cafeLoading: boolean;
}

const CafeDetailBoard = ({cafe, images, reviews, cafeLoading}: CafeDetailBoardProps) => {
    const [updatedCafe, setUpdatedCafe] = useState<TypeCafe>(cafe);
    const [isEditOn, setEditOn] = useState<boolean>(false);
   
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
    }

    const handleClick = () => {
        if(isEditOn){
            setEditOn(false);
        }else{
            setEditOn(true);
        }
    }

    return(
        <StyledFlexColumn className="board-container">
            <form onSubmit={handleSubmit}>
                <StyledFlexRow className="detail-title-button-wrapper">
                    <h3>{cafe.name}</h3>
                    {isEditOn ? 
                        <div className="edit-on"><button type="submit" onClick={handleClick}><span>변경 사항 저장</span></button></div> :
                        <div className="edit-off"><button onClick={handleClick}><span>카페 정보 변경</span></button></div>}   
                </StyledFlexRow>
                <div className="detail-basic-wrapper">
                    <h4>카페 기본 정보</h4>
                    {isEditOn ? 
                        <CafeRegisterForm cafe={updatedCafe} setCafe={setUpdatedCafe}/> 
                        : <CafeDetailBasicInfo cafe={cafe}/>}
                </div>
            </form>
            
            <div className="image-title-table-wrapper">
                <h4>이미지</h4>
                <CafeDetailImageTable images={images} imageLoading={cafeLoading} isPreview={true} 
                                        deletedImages={[]} setDeletedImages={() => []}
                                        isCheckedAll={false} setCheckedAll={() => false}/>
            </div>
            {/* <div className="review-title-table-wrapper">
                <h4>리뷰</h4>
                <CafeDetailReviewTable reviews={reviews} reviewLoading={cafeLoading} isPreview={true} 
                                        deletedReviews={[]} setDeletedReviews={() => []}
                                        isCheckedAll={false} setCheckedAll={() => false}/>
            </div> */}
        </StyledFlexColumn>
    )
}

export default CafeDetailBoard;