import React, { useState } from 'react';
import { onImageLoad } from '../../../utils/function';
import { StyledSpinnerContainer } from '../../../utils/styled';
import { CafeInfo } from '../../../utils/type';
import Spinner from '../../common/Spinner';
import CafeDetail from '../CafeDetail';
import './index.css';

type CarouselMainImageProps = {
    cafe: CafeInfo;
}

const CarouselMainImage = ({cafe}: CarouselMainImageProps) => {
    const [isImageReady, setIsImageReady] = useState<boolean>(false);
    const [isClicked, setIsClicked] = useState<boolean>(false);

    return(
        <div>
            <div className="carousel-img">
                <img src={`https://${cafe.mainImageUri}`} alt="img" style={{
                    display: isImageReady ? "initial" : "none"}} 
                    onLoad={() => onImageLoad(setIsImageReady)}
                    onClick={() => setIsClicked(true)}/>
                <StyledSpinnerContainer visible={!isImageReady} size={360}>
                    <Spinner size={24}/>
                </StyledSpinnerContainer> 
                {/* <div className="bottom-box" style={{display: index === currentIndex? "block" : "none"}}>
                    <span className="count">999</span><span className="word">개의 좋아요</span>
                    <span className="count">{cafe.viewCount}</span><span className="word">명이 봤어요</span>
                </div> */}
            </div>
             <div className="cafe-detail" style={{display: isClicked? "block" : "none"}}>
                 <CafeDetail cafe={cafe} setIsClicked={setIsClicked}/>
             </div>
        </div>       
    )
}

export default CarouselMainImage;