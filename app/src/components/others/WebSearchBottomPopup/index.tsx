import React from 'react';
import { openSearch } from '../../../utils/function';
import { StyledRowFlexCenter } from '../../../utils/styled';
import { TypeCafe } from '../../../utils/type';
import './index.css';

type WebSearchBottomPopupProps = {
    cafe: TypeCafe | null;
    isWebSearchClicked: boolean;
    setWebSearchClicked: (type: boolean) => void;
}

const WebSearchBottomPopup = ({cafe, isWebSearchClicked, setWebSearchClicked}: WebSearchBottomPopupProps) => {
    return(
        <StyledRowFlexCenter className="detail-popup" style={{
                    position: "absolute",
                    bottom: isWebSearchClicked? "0px" : "-210px"}}>
            <i className="material-icons detail-popup-close" onClick={()=>setWebSearchClicked(false)}>keyboard_arrow_down</i>
            <div className="websearch-button naver" onClick={() => openSearch((cafe?.name || "")+" "+cafe?.place.name, "Naver")}><button><img src="/images/naver-icon.png" alt="naver"/></button><span>네이버 검색 결과<br/>바로보기</span></div>
            <div className="websearch-button insta" onClick={() => openSearch((cafe?.name || ""), "Instagram")}><button><img src="/images/insta-icon.png" alt="insta"/></button><span>인스타그램 해시태그<br/>바로보기</span></div>       
        </StyledRowFlexCenter>
    )
}

export default WebSearchBottomPopup;