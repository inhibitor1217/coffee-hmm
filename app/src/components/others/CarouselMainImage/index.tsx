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
        <div className="carousel-img">
            <img src={cafe.image.count > 0 ? cafe.image.list[0].relativeUri : "/images/coffee.png"} alt="img" 
                style={{display: isImageReady ? "initial" : "none"}} 
                onLoad={() => onImageLoad(setIsImageReady)}
                onClick={handleClick}/>
            <StyledSpinnerContainer visible={!isImageReady} size={document.body.clientWidth}>
                <Spinner size={24}/>
            </StyledSpinnerContainer> 
        </div>     
    )
}

export default CarouselMainImage;