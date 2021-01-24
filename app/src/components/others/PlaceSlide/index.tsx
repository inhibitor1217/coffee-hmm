import React, { useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { SearchValueCtx } from '../../../context';
import { StyledRowFlex, StyledColumnFlex, StyledSpinnerContainer } from '../../../utils/styled';
import Spinner from '../../common/Spinner';
import './index.css';

const places: string[] =["성수", "연남", "한남", "판교", "잠실"];

const PlaceSlide = () => {
    const location = useHistory();
    const { searchValueCtx, setSearchValueCtx} = useContext(SearchValueCtx);
    const [isClicked, setClicked] = useState<boolean>(false);
    const [target, setTarget]  = useState<string>("");
    const [isImageReady, setIsImageReady] = useState<boolean>(false);
    const onImageLoad = () => {
      setIsImageReady(true);
    };

    useEffect(() => {
        async function setContext(){
            await setSearchValueCtx(target);
        }
        if(isClicked){
            setContext();
            setTarget("");
            setClicked(false);
            location.push("/place");
        }
    }, [searchValueCtx, setSearchValueCtx, target, location, isClicked])

 
    return(
        <StyledRowFlex className="card-container">
        {places.map((place, index) => {
            return(
            <StyledColumnFlex className="card-wrapper" key={place}>
                <div className="card-box" onClick={() => {
                    setTarget(place);
                    setClicked(true);
                }}>
                    <StyledSpinnerContainer visible={!isImageReady} size={40}>
                        <Spinner size={18}/>
                    </StyledSpinnerContainer>
                    <img src={`/images/icon${index%10+1}.png`} alt="icon" onLoad={onImageLoad}/>
                    <span>#{place}카페</span>
                </div>
            </StyledColumnFlex>)
        })}
        </StyledRowFlex>
    );
}




export default PlaceSlide;