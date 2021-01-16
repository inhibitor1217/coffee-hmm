import React, { useState } from 'react';
import './index.css';

const CafeSearchResultTableColumns = () => {
    const [sortBy, setSortBy] = useState<string>();
    const [ascending, setAscending] = useState<boolean>(false);

    
    const handleClick = (sortClicked: string) => {
        if(sortClicked !== sortBy){
            setAscending(false);
        }
        switch(sortClicked){
            case "createdAt" :
                if(ascending){
                    setAscending(false);
                }else{
                   setAscending(true);
                }
                setSortBy("createdAt");
                break;

            case "images" :
                if(ascending){
                    setAscending(false);
                }else{
                   setAscending(true);
                }
                setSortBy("images");
                break;

            case "reviews" :
                if(ascending){
                    setAscending(false);
                }else{
                   setAscending(true);
                }
                setSortBy("reviews");
                break;   
        }
    }

    return(
        <ul className="cafe-column-wrapper">
            <li>NAME</li>
            <li>PLACE</li>
            <li>HOUR</li>
            <li>STATUS</li>
            <li>CREATED AT <i className="material-icons-round" onClick={() => handleClick("createdAt")}>{(sortBy === "createdAt") && ascending? `arrow_drop_up` : `arrow_drop_down`}</i></li>
            <li>IMAGES <i className="material-icons-round" onClick={() => handleClick("images")}>{(sortBy === "images") && ascending? `arrow_drop_up` : `arrow_drop_down`}</i></li>
            <li>REVIEWS <i className="material-icons-round" onClick={() => handleClick("reviews")}>{(sortBy === "reviews") && ascending? `arrow_drop_up` : `arrow_drop_down`}</i></li>
        </ul>
    )
}

export default CafeSearchResultTableColumns;