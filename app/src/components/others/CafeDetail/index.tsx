import React from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';
import { useHistory } from 'react-router-dom';
import { copyLink, openSearch} from '../../../utils/function';
import { StyledColumnFlex, StyledRowFlexCenter } from '../../../utils/styled';
import { TypeCafe } from '../../../utils/type';
import CafeDetailImageCarousel from '../CafeDetailImageCarousel';
import './index.css';

type CafeDetailProps = {
    cafe: TypeCafe | null;
    setCafe: (cafe: TypeCafe | null) => void;
}

const CafeDetail = ({ cafe }: CafeDetailProps) => {
    const currentCopyLink = `https://coffee-hmm.inhibitor.io/cafe/${cafe?.id}`;
    const history = useHistory();
    
    const handleClick = () => {
        history.goBack();
    }

    return(
        <div>
            <button className="detail-back-button" onClick={handleClick}><i className="material-icons">keyboard_arrow_left</i></button>
            <CafeDetailImageCarousel cafe={cafe}/>

            <StyledColumnFlex>
                <div className="detail-info">
                    <span className="detail-name">{cafe?.name}</span>
                    <span className="detail-place">{cafe?.place.name}</span>
                    <span className="detail-time">OPEN {cafe?.metadata?.hour}</span>
                </div>

                <StyledRowFlexCenter className="detail-button-wrapper">
                    <div className="detail-button"><button className="detail-like"><i className="material-icons-round">favorite</i></button><span>좋아요</span></div>
                    <div className="detail-button"> <CopyToClipboard text={currentCopyLink}><button className="detail-share" onClick={() => copyLink(cafe?.name)}><i className="material-icons-round">share</i></button></CopyToClipboard><span>흠 링크<br/>공유하기</span></div>
                    <div className="detail-button" onClick={() => openSearch((cafe?.name || "")+" "+cafe?.place.name, "Naver")}><button className="detail-naver"><img src="/images/naver-icon.png" alt="naver"/></button><span>네이버 검색<br/>바로가기</span></div>
                    <div className="detail-button" onClick={() => openSearch((cafe?.name || ""), "Instagram")}><button className="detail-insta"><img src="/images/insta-icon.png" alt="insta"/></button><span>인스타그램<br/>바로가기</span></div>  
                </StyledRowFlexCenter>
            </StyledColumnFlex>
        </div>
    )
}

export default React.memo(CafeDetail);