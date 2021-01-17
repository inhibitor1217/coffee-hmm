import React, { useState } from 'react';
import { onImageLoad } from '../../../utils/function';
import { StyledSpinnerContainer } from '../../../utils/styled';
import { CafeInfo } from '../../../utils/type';
import Spinner from '../../common/Spinner';
import './index.css';

type CarouselMainImageProps = {
    cafe: CafeInfo;
    setCafe: (cafe: CafeInfo | null) => void;
}

const CarouselMainImage = ({cafe, setCafe}: CarouselMainImageProps) => {
    const [isImageReady, setIsImageReady] = useState<boolean>(false);

    return(
        <div>
            <div className="carousel-img">
                <img src={`https://${cafe.mainImageUri}`} alt="img" style={{
                    display: isImageReady ? "initial" : "none"}} 
                    onLoad={() => onImageLoad(setIsImageReady)}
                    onClick={() => setCafe(cafe)}/>
                <StyledSpinnerContainer visible={!isImageReady} size={360}>
                    <Spinner size={24}/>
                </StyledSpinnerContainer> 

                <div className="bottom-box">
                    <span className="count">999</span><span className="word">개의 좋아요</span>
                    <span className="count">{cafe.viewCount}</span>
                    <span className="word">명이 봤어요</span>
                </div>
            </div>
        </div>       
    )
}

export default CarouselMainImage;