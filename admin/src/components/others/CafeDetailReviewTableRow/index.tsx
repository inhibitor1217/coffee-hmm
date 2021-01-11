import React, { useContext, useEffect, useState } from 'react';
import { ModalContext, ReviewContext } from '../../../context';
import { TypeReview } from '../../../utils/Type';
import './index.css';

type CafeDetailReviewTableRowProps = {
    review: TypeReview;
    isPreview: boolean;
    deletedReviews: string[];
    setDeletedReviews: (deletedReviews: string[]) => void;
    isCheckedAll: boolean;
}

const CafeDetailReviewTableRow = ({review, isPreview, deletedReviews, setDeletedReviews, isCheckedAll}: CafeDetailReviewTableRowProps) => {
    const [checked, setChecked] = useState<boolean>(isCheckedAll);
    const {setModalOpen} = useContext(ModalContext);
    const {setReview} = useContext(ReviewContext);

    useEffect(() => {
       setChecked(isCheckedAll);
    }, [isCheckedAll])

    const handleChecked = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if(e.target.checked){
            setChecked(true);
            setDeletedReviews([
                ...deletedReviews,
                value
            ]);
        }else{
            setChecked(false);
            setDeletedReviews(deletedReviews.filter(id => (id !== value)));
        }
    }

    const handleClick = () => {
        setModalOpen(true);
        setReview(review);
    }

    return(
        <ul className="review-row-wrapper">
            <li style={{display: isPreview? "none":"block", paddingRight: "0px"}}><input type="checkbox" name="reviewId" value={review.id} onChange={handleChecked} checked={checked}/></li>
            <li onClick={handleClick} style={{fontWeight: isPreview? "normal":"bold", textDecoration: isPreview? "none":"underline"}}>{review.id}</li>
            <li>{review.userId}</li>
            <li>{review.status}</li>
            <li>{review.createdAt}</li>
            <li>{review.images}</li>
            <li className="review-row-content">{review.content}</li>
        </ul>
    )
}

export default CafeDetailReviewTableRow;