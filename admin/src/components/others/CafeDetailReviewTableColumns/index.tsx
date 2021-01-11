import React, { useEffect, useState } from 'react';
import { TypeReview } from '../../../utils/Type';
import './index.css';

type CafeDetailReviewTableColumnsProps = {
    isPreview: boolean;
    reviews: TypeReview[];
    deletedReviews: string[];
    setDeletedReviews: (deletedReviews: string[]) => void;
    isCheckedAll: boolean;
    setCheckedAll: (isCheckedAll: boolean) => void;
}

const CafeDetailReviewTableColumns = ({isPreview, reviews, deletedReviews, setDeletedReviews, isCheckedAll, setCheckedAll}: CafeDetailReviewTableColumnsProps) => {
    const [isSortByCreatedAt, setSortByCreatedAt] = useState<boolean>(false);
    const [isSortByImages, setSortByImages] = useState<boolean>(false);
    const [checked, setChecked] = useState<boolean>(isCheckedAll);

    useEffect(() => {
        setChecked(isCheckedAll);
        if(reviews.length >= 10){
            if(deletedReviews.length !== 10){
                setChecked(false);
            }
        }else{
            if(deletedReviews.length !== reviews.length){
                setChecked(false)
            }
        }
     }, [isCheckedAll, deletedReviews, reviews])

    const handleCheckedAll = (e: React.ChangeEvent<HTMLInputElement>) => {
        if(e.target.checked){
            setCheckedAll(true);
            const reviewIds = reviews.map(review => review.id.toString());
            setDeletedReviews(reviewIds);
        }else{
            setCheckedAll(false);
            setDeletedReviews([]);    
        }
    }

    const handleClick = (sortBy: string) => {
        switch(sortBy){
            case "createdAt" :
                if(isSortByCreatedAt){
                    setSortByCreatedAt(false);
                }else{
                    setSortByCreatedAt(true);
                    setSortByImages(false);
                }
                break;

            case "images" :
                if(isSortByImages){
                    setSortByImages(false);
                }else{
                    setSortByCreatedAt(false);
                    setSortByImages(true);
                }
                break; 
        }
    }
    return(
        <ul className="review-column-wrapper">
            <li style={{display: isPreview? "none": "block", paddingRight: "0px"}}><input type="checkbox" onChange={handleCheckedAll} checked={checked}/></li>
            <li>REVIEW ID</li>
            <li>USER ID</li>
            <li>STATUS <i className="material-icons" style={{fontSize: "16px"}}>help_outline</i></li>
            <li>CREATED AT  <i className="material-icons-round" onClick={() => handleClick("createdAt")}>{isSortByCreatedAt? `arrow_drop_up` : `arrow_drop_down`}</i></li>
            <li>IMAGES <i className="material-icons-round" onClick={() => handleClick("images")}>{isSortByImages? `arrow_drop_up` : `arrow_drop_down`}</i></li>
            <li>CONTENT</li>
        </ul>
    )
}

export default CafeDetailReviewTableColumns;