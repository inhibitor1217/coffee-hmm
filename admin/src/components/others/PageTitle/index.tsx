import React from 'react';
import { useLocation } from 'react-router-dom';
import './index.css';

type PageTitleProps = { 
    cafeId: string;
    name: string;
}

const PageTitle =({cafeId, name}: PageTitleProps) => {
    const location = useLocation();

    switch(location.pathname){
        case "/cafes":
        case "/register":
            return(
                <div className="page-title">Coffee Hmm / 카페</div>
            );  

        case `/cafes/${cafeId}`:
            return(
                <div className="page-title">Coffee Hmm / 카페 / {name}</div>
            ); 

        case `/cafes/${cafeId}/review`:
            return(
                <div className="page-title">Coffee Hmm / 카페 / {name} / 리뷰</div>
            ); 

        case `/cafes/${cafeId}/image`:
            return(
                <div className="page-title">Coffee Hmm / 카페 / {name} / 이미지</div>
            ); 
    }
    return(
        <div>Coffee Hmm</div>
    )
}

export default PageTitle;