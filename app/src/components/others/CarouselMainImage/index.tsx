import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { onImageLoad } from '../../../utils/function';
import { StyledSpinnerContainer } from '../../../utils/styled';
import { TypeCafe } from '../../../utils/type';
import Spinner from '../../common/Spinner';
import './index.css';

type CarouselMainImageProps = {
    cafe: TypeCafe;
}

const CarouselMainImage = ({cafe}: CarouselMainImageProps) => {
    const [isImageReady, setIsImageReady] = useState<boolean>(false);
    const history = useHistory();

    const handleClick = async () => {
        history.push({
            pathname: `/cafe/${cafe.id}`,
        })
    }

    return(
        <div>
            <div className="carousel-img">
                <img src="/images/coffee.png" alt="img" style={{
                    display: isImageReady ? "initial" : "none"}} 
                    onLoad={() => onImageLoad(setIsImageReady)}
                    onClick={handleClick}/>
                <StyledSpinnerContainer visible={!isImageReady} size={360}>
                    <Spinner size={24}/>
                </StyledSpinnerContainer> 

                <div className="bottom-box">
                    <span className="count">{cafe.numLikes}</span>
                    <span className="word">개의 좋아요</span>
                    <span className="count">{cafe.views.total}</span>
                    <span className="word">명이 봤어요</span>
                </div>
            </div>
        </div>       
    )
}

export default CarouselMainImage;