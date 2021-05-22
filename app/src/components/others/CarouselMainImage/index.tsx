import React, { useState } from 'react';
import { useAppDispatch } from '../../../store/hooks';
import introNavSlice from '../../../store/modules/intro-nav';
import { onImageLoad } from '../../../utils/function';
import { StyledSpinnerContainer } from '../../../utils/styled';
import { TypeCafe } from '../../../utils/type';
import Spinner from '../../common/Spinner';
import './index.css';

type CarouselMainImageProps = {
  cafe: TypeCafe;
  index: number;
};

const CarouselMainImage: React.FC<CarouselMainImageProps> = ({
  cafe,
  index,
}: CarouselMainImageProps) => {
  const [isImageReady, setImageReady] = useState(false);
  const mainImage = cafe.image.list.find((image) => image.isMain);
  const dispatch = useAppDispatch();
  const handleLoad = () => {
    onImageLoad(setImageReady);
    dispatch(introNavSlice.actions.setImageReady(index));
  };

  return (
    <div className="carousel-img">
      {mainImage && (
        <img
          src={
            cafe.image.count > 0 ? mainImage.relativeUri : '/images/coffee.png'
          }
          alt="img"
          style={{ display: isImageReady ? 'initial' : 'none' }}
          onLoad={handleLoad}
        />
      )}
      <StyledSpinnerContainer
        visible={!isImageReady}
        size={document.body.clientWidth}
      >
        <Spinner size={24} />
      </StyledSpinnerContainer>
    </div>
  );
};

export default CarouselMainImage;
