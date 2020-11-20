import React, { useState } from 'react';
import { moveDownOrRight, moveUpOrLeft, onImageLoad, slidePosition } from '../../../utils/function';
import { StyledRowFlex, StyledSpinnerContainer } from '../../../utils/styled';
import { CafeInfo } from '../../../utils/type';
import Spinner from '../../common/Spinner';
import './index.css';

type CafeImageSlideProps = {
    cafe: CafeInfo;
}


const MID = 0;
const LEFT = -330;
const RIGHT = 330;

const CafeImageSlide = ({cafe}: CafeImageSlideProps) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isImageReady, setIsImageReady] = useState<boolean>(false);
    return(
        <div>
            <StyledRowFlex className="slide-box">
            {cafe.imageUris.map((image, index) => {   
                return(
                    <div key={index}  className="cafe-slide" style={{
                        left: currentIndex === index? slidePosition(index, currentIndex, MID, LEFT, RIGHT): slidePosition(index, currentIndex, MID, LEFT, RIGHT)
                    }}>
                        <img src={`https://${image}`} alt="img" onLoad={() => onImageLoad(setIsImageReady)}/>
                        <StyledSpinnerContainer visible={!isImageReady} size={360}>
                            <Spinner size={24}/>
                        </StyledSpinnerContainer>
                        <button className="prev-button" style={{display: index === 0 ? "none":"block"}} onClick={()=>moveUpOrLeft(currentIndex, setCurrentIndex)}>prev</button>
                        <button className="next-button" style={{display: index === cafe.imageUris.length-1? "none":"block"}} onClick={()=>moveDownOrRight(currentIndex, setCurrentIndex, cafe.imageUris.length-1)}>next</button>
                    </div>
                )
            })
            }
            
            </StyledRowFlex>
        </div>
      
    )
}

export default CafeImageSlide;