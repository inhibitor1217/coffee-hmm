import React, { useState } from 'react';
import { BIG_CAFE_IMAGE_SIZE, SMALL_CAFE_IMAGE_SIZE } from '../../../utils/constant';
import { onImageLoad } from '../../../utils/function';
import { StyledSpinnerContainer } from '../../../utils/styled';
import { CafeInfo } from '../../../utils/type';
import Spinner from '../../common/Spinner';
import CafeDetail from '../CafeDetail';
import './index.css';

type CafeListOneCafeProps = {
    index: number;
    currentIndex: number;
    cafe: CafeInfo;
    isBig: boolean;
}

const CafeListOneCafe = ({index, currentIndex, cafe, isBig}: CafeListOneCafeProps) => {
    const [isImageReady, setIsImageReady] = useState<boolean>(false);
    const [isClicked, setIsClicked] = useState<boolean>(false);

    return(
        <div>
             <div className="cafe-box">
                <img src={`https://${cafe.mainImageUri}`} alt="cafe" 
                style={{display: isImageReady ? "initial" : "none", 
                        width: isBig? `${BIG_CAFE_IMAGE_SIZE}px` : `${SMALL_CAFE_IMAGE_SIZE}px`,
                        height: isBig? `${BIG_CAFE_IMAGE_SIZE}px`: `${SMALL_CAFE_IMAGE_SIZE}px`}} 
                onLoad={() => onImageLoad(setIsImageReady)}
                onClick={() => setIsClicked(true)}/>
                <StyledSpinnerContainer visible={!isImageReady} size={360}>
                    <Spinner size={24}/>
                </StyledSpinnerContainer> 
                <div className="bottom-box" style={{display: index === currentIndex? "block" : "none"}}>
                    <span className="count">999</span><span className="word">개의 좋아요</span>
                    <span className="count">{cafe.viewCount}</span><span className="word">명이 봤어요</span>
                </div>
            </div>
            
            <div className="cafe-detail" style={{display: isClicked? "block" : "none"}}>
                <CafeDetail cafe={cafe} setIsClicked={setIsClicked}/>
            </div>
        </div>
       
    )
}

export default CafeListOneCafe;