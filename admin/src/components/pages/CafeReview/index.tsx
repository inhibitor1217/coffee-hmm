import React, { useContext, useEffect, useState } from 'react';
import { ModalContext, ReviewContext } from '../../../context';
import Modal from '../../../Modal';
import ReviewModal from '../../../modalContents/reviewModal';
import { StyledFlexColumn } from '../../../utils/Styled';
import { Cafe, TypeReview } from '../../../utils/Type';
import CafeReviewBoard from '../../others/CafeReviewBoard';
import PageTitle from '../../others/PageTitle';
import './index.css';

const cafe: Cafe = {id: 1, name: "cafe1", place: "판교", openHour: "9:00", closeHour: "19:00", status: "visible", createdAt: "2020-12-01", updatedAt:"2020-12-08", images: 2, reviews: 2 };
const reviewsTest: TypeReview[] = [
    {id: 1, userId:4, status:"visible", content:"test contenttest contenttest contenttest contenttest contenttest contenttest contenttest contenttest contenttest contenttest contenttest contenttest contenttest contenttest contenttest contenttest contenttest content", images:5, createdAt:"2020-12-01"},
    {id: 2, userId:3, status:"hidden", content:"", images:5, createdAt:"2020-12-02"},
    {id: 3, userId:4, status:"hidden", content:"", images:5, createdAt:"2020-12-01"},
    {id: 4, userId:3, status:"visible", content:"", images:5, createdAt:"2020-12-01"},
    {id: 5, userId:9, status:"visible", content:"", images:5, createdAt:"2020-12-04"},
    {id: 6, userId:1, status:"visible", content:"", images:5, createdAt:"2020-12-01"},
    {id: 7, userId:2, status:"visible", content:"", images:5, createdAt:"2020-12-01"},
    {id: 8, userId:1, status:"hidden", content:"", images:5, createdAt:"2020-12-01"},
    {id: 9, userId:10, status:"visible", content:"", images:5, createdAt:"2020-12-01"},
    {id: 10, userId:11, status:"visible", content:"", images:5, createdAt:"2020-12-01"},
    {id: 11, userId:12, status:"visible", content:"", images:5, createdAt:"2020-12-01"},
    {id: 12, userId:1, status:"visible", content:"", images:5, createdAt:"2020-12-01"},
]

const CafeReview = () => {
    const [reviews, setReviews] = useState<TypeReview[]>([]);
  
    const [reviewLoading, setReviewLoading] = useState(false);
    const [isCheckedAll, setCheckedAll] = useState<boolean>(false);
    const [isEditOn, setEditOn] = useState<boolean>(false);
    const {setModalOpen} = useContext(ModalContext);
   
    useEffect(() => {
//      async function fetchReviewData(){
            setReviewLoading(true);
//     //fetch review data .thenm(data => setReviews(data))
            setReviewLoading(false);
        setReviews(reviewsTest);
    }, [])

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
         // fetch change review status mode
     }

    return(
        <ReviewContext.Consumer>
            {review => {
                return(
                    <div>
                        <StyledFlexColumn className="review-container">
                            <PageTitle cafeId={cafe.id} name={cafe.name}/>
                            <CafeReviewBoard name={cafe.name} reviews={reviews} reviewLoading={reviewLoading} 
                                            isCheckedAll={isCheckedAll} setCheckedAll={setCheckedAll}/>
                        </StyledFlexColumn>
                        <form onSubmit={handleSubmit}>
                            <Modal>
                                <ReviewModal setModalOpen={setModalOpen} review={review.review} isEditOn={isEditOn} setEditOn={setEditOn}/>
                            </Modal>
                        </form>
                    </div>
                )
            }}
        </ReviewContext.Consumer>
    )
}

export default CafeReview;