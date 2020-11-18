import React from 'react';
import './index.css';

type NoSearchResultProps = {
    searchValue: string;
}

const NoSearchResult = ({searchValue}: NoSearchResultProps) => {
    return(
        <div>
            <div className="no-search-header">{searchValue} 카페 검색 결과 0</div>
            <div className="empty-image-wrapper">
                <img className="empty-img" src="/images/empty.png" alt="empty"/>
                <img className="cookie-img" src="/images/cookie.png" alt="cookie"/>
            </div>
            <div className="no-search-text">{searchValue} 카페 검색결과가 없습니다.</div>
        </div>
    )
}

export default NoSearchResult;