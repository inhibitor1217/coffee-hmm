import React from 'react';
import { useHistory } from 'react-router-dom';
import { onImageLoad } from '../../../utils/function';
import { StyledSpinnerContainer } from '../../../utils/styled';
import { TypeCafe } from '../../../utils/type';
import Spinner from '../../common/Spinner';
import './index.css';

type CarouselMainImageProps = {
    cafe: TypeCafe;
    isImageReady: boolean;
    setIsImageReady: (isImageReady: boolean) => void;
}

const CarouselMainImage = ({cafe, isImageReady, setIsImageReady}: CarouselMainImageProps) => {
    const history = useHistory();
    const mainImage = cafe.image.list.find((image) => image.isMain);

    const handleClick = async () => {
        history.push({
            pathname: `/cafe/${cafe.id}`,
        })
    }

    return(
        <div className="carousel-img">
            {mainImage && <img src={cafe.image.count > 0 ? mainImage.relativeUri : "/images/coffee.png"} alt="img" 
                style={{display: isImageReady ? "initial" : "none"}} 
                onLoad={() => onImageLoad(setIsImageReady)}
                onClick={handleClick}/>}
            <StyledSpinnerContainer visible={!isImageReady} size={document.body.clientWidth}>
                <Spinner size={24}/>
            </StyledSpinnerContainer> 
        </div>     
    )
}

export default CarouselMainImage;