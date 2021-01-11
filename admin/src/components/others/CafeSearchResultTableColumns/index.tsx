import React, { useState } from 'react';
import './index.css';

const CafeSearchResultTableColumns = () => {
    const [isSortByCreatedAt, setSortByCreatedAt] = useState<boolean>(false);
    const [isSortByImages, setSortByImages] = useState<boolean>(false);
    const [isSortByReviews, setSortByReviews] = useState<boolean>(false);

    const handleClick = (sortBy: string) => {
        switch(sortBy){
            case "createdAt" :
                if(isSortByCreatedAt){
                    setSortByCreatedAt(false);
                }else{
                    setSortByCreatedAt(true);
                    setSortByImages(false);
                    setSortByReviews(false);
                }
                break;

            case "images" :
                if(isSortByImages){
                    setSortByImages(false);
                }else{
                    setSortByCreatedAt(false);
                    setSortByImages(true);
                    setSortByReviews(false);
                }
                break;

            case "reviews" :
                if(isSortByReviews){
                    setSortByReviews(false);
                }else{
                    setSortByCreatedAt(false);
                    setSortByImages(false);
                    setSortByReviews(true); 
                }
                break;   
        }
    }

    return(
        <ul className="cafe-column-wrapper">
            <li>NAME</li>
            <li>PLACE</li>
            <li>HOUR</li>
            <li>STATUS</li>
            <li>CREATED AT <i className="material-icons-round" onClick={() => handleClick("createdAt")}>{isSortByCreatedAt? `arrow_drop_up` : `arrow_drop_down`}</i></li>
            <li>IMAGES <i className="material-icons-round" onClick={() => handleClick("images")}>{isSortByImages? `arrow_drop_up` : `arrow_drop_down`}</i></li>
            <li>REVIEWS <i className="material-icons-round" onClick={() => handleClick("reviews")}>{isSortByReviews? `arrow_drop_up` : `arrow_drop_down`}</i></li>
        </ul>
    )
}

export default CafeSearchResultTableColumns;