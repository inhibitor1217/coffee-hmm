import React from 'react';
import { StyledRowFlex } from '../../../utils/styled';
import { TypePlace } from '../../../utils/type';
import './index.css';

type PlaceSlideProps = {
    places: TypePlace[];
    currentPlaceIndex: number;
    setCurrentPlaceIndex: (index: number) => void;
}

const PlaceSlide = ({places, currentPlaceIndex, setCurrentPlaceIndex}: PlaceSlideProps) => {
    const handleClick = (index: number) => {
        setCurrentPlaceIndex(index);
;    }
 
    return(
        <StyledRowFlex className="place-container">
            {places.map((place, index) => {
                return(
                    <div key={place.id} className="place-wrapper" onClick={() => handleClick(index)}>
                        <span className="place-box" style={{backgroundColor:(currentPlaceIndex === index)? 'rgba(196, 196, 196, 0.3' : 'transparent'}}>{place.name}</span>
                        <span className="place-dot" style={{backgroundColor: (currentPlaceIndex === index)? '#ED6161' : 'transparent'}}></span>
                    </div>
                )
            })}
        </StyledRowFlex>
    );
}




export default PlaceSlide;