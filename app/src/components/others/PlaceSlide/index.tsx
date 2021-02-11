import React from 'react';
import { StyledRowFlex } from '../../../utils/styled';
import { TypePlace } from '../../../utils/type';
import './index.css';

type PlaceSlideProps = {
    places: TypePlace[];
    currentPlace: TypePlace;
    setCurrentPlace: (currentPlace: TypePlace) => void;
}

const PlaceSlide = ({places, currentPlace, setCurrentPlace}: PlaceSlideProps) => {
    const handleClick = (place: TypePlace) => {
        setCurrentPlace(place);
;    }
 
    return(
        <StyledRowFlex className="place-container">
            {places.map((place) => {
                return(
                    <div key={place.id} className="place-wrapper" onClick={() => handleClick(place)}>
                        <span className="place-box" style={{backgroundColor:(currentPlace.name === place.name)? 'rgba(196, 196, 196, 0.3' : 'transparent'}}>{place.name}</span>
                        <span className="place-dot" style={{backgroundColor: (currentPlace.name === place.name)? '#ED6161' : 'transparent'}}></span>
                    </div>
                )
            })}
        </StyledRowFlex>
    );
}




export default PlaceSlide;