import React, { useState } from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';
import { copyLink} from '../../../utils/function';
import { StyledColumnFlex, StyledRowFlexCenter } from '../../../utils/styled';
import { CafeInfo } from '../../../utils/type';
import CafeDetailImageCarousel from '../CafeDetailImageCarousel';
import WebSearchBottomPopup from '../WebSearchBottomPopup';
import './index.css';

type CafeDetailProps = {
    cafe: CafeInfo | null;
    setCafe: (cafe: CafeInfo | null) => void;
}

const CafeDetail = ({ cafe, setCafe}: CafeDetailProps) => {
    const [isWebSearchClicked, setWebSearchClicked] = useState<boolean>(false);
    const currentCopyLink = `https://coffee-hmm.inhibitor.io/cafe/${cafe?.id}`;
    
    const handleClick = () => {
        setCafe(null);
    }

    return(
        <div>
            <button className="detail-close-button" onClick={handleClick}><i className="material-icons">keyboard_arrow_left</i></button>
            <CafeDetailImageCarousel cafe={cafe}/>

            <StyledColumnFlex>
                <div className="detail-info">
                    <span className="detail-name">{cafe?.name}</span>
                    <span className="detail-place">{cafe?.place}</span>
                    <span className="detail-time">open 9:00 ~ 19:00</span>
                </div>

                <StyledRowFlexCenter className="detail-button-wrapper">
                    <div className="detail-button"><button className="detail-like"><i className="material-icons-round">favorite</i></button><span>좋아요</span></div>
                    <div className="detail-button"> <CopyToClipboard text={currentCopyLink}><button className="detail-share" onClick={() => copyLink(cafe?.name)}><i className="material-icons-round">share</i></button></CopyToClipboard><span>링크 공유</span></div>
                    <div className="detail-button"><button className="detail-review"><i className="material-icons-round">create</i></button><span>카페 리뷰</span></div>
                    <div className="detail-button"><button className="detail-photo"><i className="material-icons-round">photo_library</i></button><span>사진 업로드</span></div>  
                </StyledRowFlexCenter>

                <div className="detail-more">
                    <h5>카페의 구체적인 정보가 필요하신가요&#63;</h5>
                    <div className="detail-more-button"><button onClick={() => setWebSearchClicked(true)}>네이버, 인스타 검색 바로가기 &#10154;</button></div>
                    <div className="detail-map-button"><button>지도 바로가기 &#10154;</button></div>
                    <WebSearchBottomPopup cafe={cafe} isWebSearchClicked={isWebSearchClicked} setWebSearchClicked={setWebSearchClicked}/>
                </div>
            </StyledColumnFlex>
        </div>
    )
}

export default React.memo(CafeDetail);