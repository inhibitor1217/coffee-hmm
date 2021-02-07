import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { StyledColor, StyledChessDiv, StyledSpinnerContainer } from '../../../utils/styled';
import { TypePlace } from '../../../utils/type';
import { getPlaceList } from '../../api';
import Spinner from '../../common/Spinner';
import './index.css';

const PlaceSlide = () => {
    const location = useHistory();
    const [places, setPlaces] = useState<TypePlace[]>([]);
    const [placeLoading, setPlaceLoadint] = useState<boolean>(false);

    useEffect(() => {
        const fetchData = async () => {  
            await getPlaceList().then(data => {
                if(data) {
                    setPlaces(data.place.list)
                }
                setPlaceLoadint(true);
            })   
        }
        fetchData();  
    }, [])

    const handleClick = (place: string) => {
        location.push(`/place/${place}`);
    }


 
    return(
        <StyledChessDiv className="card-container">
            <StyledSpinnerContainer visible={!placeLoading} size={200}>
                <Spinner size={24}/>
            </StyledSpinnerContainer> 
            {placeLoading && places.map((place, index) => {
                return(
                    <div key={place.id} className="card-box" onClick={() => handleClick(place.name)}>
                        <span className="place-color-dot" style={{backgroundColor: StyledColor[index%10+1]}}></span>
                        <span>{place.name}</span>
                    </div>
            )
            })}
        </StyledChessDiv>
    );
}




export default PlaceSlide;