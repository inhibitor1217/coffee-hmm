import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { StyledRowFlex, StyledColumnFlex, StyledSpinnerContainer } from '../../../utils/styled';
import { TypePlace } from '../../../utils/type';
import { getPlaceList } from '../../api';
import Spinner from '../../common/Spinner';
import './index.css';

const PlaceSlide = () => {
    const location = useHistory();
    const [places, setPlaces] = useState<TypePlace[]>([]);

    const [isImageReady, setIsImageReady] = useState<boolean>(false);
    const onImageLoad = () => {
      setIsImageReady(true);
    };

    useEffect(() => {
        const fetchData = async () => {
            await getPlaceList().then(data => {
                if(data) {
                    setPlaces(data.place.list)
                }
            })
        }
        fetchData();
    }, [])

    const handleClick = (place: string) => {
        location.push(`/place/${place}`);
    }
 
    return(
        <StyledRowFlex className="card-container">
        {places.length > 0 && places.map((place, index) => {
            return(
            <StyledColumnFlex className="card-wrapper" key={place.id}>
                <div className="card-box" onClick={() => handleClick(place.name)}>
                    <StyledSpinnerContainer visible={!isImageReady} size={40}>
                        <Spinner size={18}/>
                    </StyledSpinnerContainer>
                    <img src={`/images/icon${index%10+1}.png`} alt="icon" onLoad={onImageLoad}/>
                    <span>#{place.name}카페</span>
                </div>
            </StyledColumnFlex>)
        })}
        </StyledRowFlex>
    );
}




export default PlaceSlide;